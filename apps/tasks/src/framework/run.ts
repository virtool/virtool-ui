import type { Db } from "@virtool/data/db/pg";
import {
	type ClaimedTask,
	completeTask,
	failTask,
} from "@virtool/data/tasks/data";
import type { Logger } from "@virtool/logger";
import type {
	RegisteredTask,
	StepProgressReporter,
	TaskHandlerArgs,
	TaskHelpers,
} from "./define";
import {
	createProgressWriter,
	type ProgressWriter,
	roundHalfToEven,
} from "./progress";

/**
 * How a run ended.
 *
 * `fenced` is not a failure of this runner's: the lease expired, another runner
 * has the task and is running it again from step zero. Nothing further may be
 * written or emitted for it. `aborted` is a shutdown — the row is left exactly
 * as it stands, for the caller to release.
 */
export type TaskOutcome =
	| { status: "completed" }
	| { status: "failed"; error: string }
	| { status: "aborted" }
	| { status: "fenced" };

/** What {@link runTask} needs to dispatch one claimed task. */
export type RunTaskOptions<C> = {
	db: Db;
	def: RegisteredTask<C>;
	task: ClaimedTask;
	ctx: C;
	logger: Logger;
	signal: AbortSignal;
	/** Overrides the progress debounce window. For tests. */
	debounceMs?: number;
};

/**
 * Render an error for the `error` column.
 *
 * Python writes `f"{type(e)}: {e!s}"`, which puts `"<class 'ValueError'>: boom"`
 * in front of a user. The name alone is what anyone reading the task list
 * actually wants.
 */
function describeError(err: unknown): string {
	return err instanceof Error ? `${err.name}: ${err.message}` : String(err);
}

/** Build the `runStep` a handler scales its progress through. */
function createHelpers(
	steps: readonly string[],
	writer: ProgressWriter,
): TaskHelpers {
	async function runStep<T>(
		name: string,
		fn: (report: StepProgressReporter) => Promise<T>,
	): Promise<T> {
		const index = steps.indexOf(name);
		const declared = index !== -1;

		const sliceStart = declared ? (100 * index) / steps.length : 0;
		const sliceEnd = declared ? (100 * (index + 1)) / steps.length : 100;

		// The step name and the basis are written before the body runs, matching
		// Python, and immediately rather than on the debounce: entering a step is
		// the transition a watching user notices.
		await writer.setNow({
			step: name,
			...(declared && { progress: roundHalfToEven(sliceStart) }),
		});

		function report(frac: number): void {
			const clamped = Math.min(Math.max(frac, 0), 1);

			writer.set({
				progress: roundHalfToEven(
					sliceStart + clamped * (sliceEnd - sliceStart),
				),
			});
		}

		try {
			return await fn(report);
		} finally {
			if (declared) {
				// So a step that reported nothing still advances the bar.
				await writer.setNow({ progress: roundHalfToEven(sliceEnd) });
			}
		}
	}

	return { runStep };
}

/** Run `def.cleanup`, swallowing anything it throws. */
async function runCleanup<C>(
	def: RegisteredTask<C>,
	args: TaskHandlerArgs<unknown, C>,
	logger: Logger,
): Promise<void> {
	if (def.cleanup === undefined) {
		return;
	}

	try {
		await def.cleanup(args);
	} catch (err) {
		// Never rethrown: the failure that provoked the cleanup is the one worth
		// recording, and losing it to a secondary error in the handler that was
		// meant to tidy up after it is how the original cause disappears.
		logger.error(
			{ err, task_id: args.taskId, type: def.type },
			"task cleanup failed",
		);
	}
}

/**
 * Dispatch one claimed task and report how it ended.
 *
 * The whole terminal contract lives here. A handler that returns while the
 * signal is clear completes the task; one that throws fails it, with
 * `${err.name}: ${err.message}` on the row. A payload the schema rejects fails
 * it before any handler code runs. Progress is flushed before either terminal
 * write, so a bar can never be stranded at the value a pending debounce was
 * holding.
 *
 * `cleanup` runs on every outcome but success — including the one that is easy
 * to miss, where a handler notices `signal.aborted` and returns *cleanly*. That
 * path looks exactly like success to a naive `catch`-only implementation, and
 * skips the cleanup silently.
 *
 * It runs nothing after a fence. A `false` from a guarded write means the lease
 * expired and another runner now owns the task and is re-running it; a cleanup
 * here would be tearing down the new owner's work.
 *
 * This function does not release, retry or reschedule. It writes progress and a
 * terminal status, and returns — what to do with an `aborted` or `fenced`
 * outcome is the runner's.
 */
export async function runTask<C>(
	options: RunTaskOptions<C>,
): Promise<TaskOutcome> {
	const { ctx, db, def, logger, signal, task } = options;

	const writer = createProgressWriter({
		db,
		taskId: task.id,
		runnerId: task.runnerId,
		logger,
		...(options.debounceMs !== undefined && { debounceMs: options.debounceMs }),
	});

	const parsed = def.payload.safeParse(task.context);

	if (!parsed.success) {
		const message = `Invalid payload: ${parsed.error.issues
			.map((issue) => `${issue.path.join(".") || "(root)"}: ${issue.message}`)
			.join("; ")}`;

		logger.error(
			{ task_id: task.id, type: def.type, message },
			"task payload did not match its schema",
		);

		const held = await failTask(db, task.id, task.runnerId, message);

		return held ? { status: "failed", error: message } : { status: "fenced" };
	}

	const args: TaskHandlerArgs<unknown, C> = {
		ctx,
		helpers: createHelpers(def.steps ?? [], writer),
		logger,
		payload: parsed.data,
		signal,
		taskId: task.id,
	};

	let failure: unknown;
	let threw = false;

	try {
		await def.run(args);
	} catch (err) {
		failure = err;
		threw = true;
	}

	await writer.flush();

	if (writer.isFenced()) {
		logger.warn(
			{ task_id: task.id, type: def.type },
			"abandoned a task reclaimed by another runner",
		);

		return { status: "fenced" };
	}

	if (!threw && !signal.aborted) {
		const held = await completeTask(db, task.id, task.runnerId);

		return held ? { status: "completed" } : { status: "fenced" };
	}

	await runCleanup(def, args, logger);

	if (signal.aborted) {
		// Abort wins over a throw. A body interrupted mid-shutdown usually throws
		// on its way out, and recording that as a permanent failure would burn a
		// task whose only problem was the pod going away.
		if (threw) {
			logger.debug(
				{ err: failure, task_id: task.id, type: def.type },
				"task threw while aborting",
			);
		}

		return { status: "aborted" };
	}

	const message = describeError(failure);

	logger.error(
		{ err: failure, task_id: task.id, type: def.type },
		"task failed",
	);

	const held = await failTask(db, task.id, task.runnerId, message);

	return held ? { status: "failed", error: message } : { status: "fenced" };
}
