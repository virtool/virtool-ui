import type { Logger } from "@virtool/logger";
import type { WorkflowContext } from "./context";
import type { HookRegistry } from "./hooks";
import type { ResolvedWorkflowStep, Workflow } from "./step";

/** Terminal state of a run. Mirrors Python's `JobState`. */
export type RunState = "succeeded" | "failed" | "cancelled";

/**
 * Cancellation and termination signalling for one run. Replaces Python's
 * `Events`.
 */
export type RunSignals = {
	signal: AbortSignal;
	isCancelled: () => boolean;
	isTerminated: () => boolean;
	/** Ping response reported `cancelled: true`. */
	cancel: () => void;
	/** SIGTERM received. */
	terminate: () => void;
};

/** Options for {@link runWorkflow}. */
export type RunWorkflowOptions<TData, TState> = {
	workflow: Workflow<TData, TState>;
	context: WorkflowContext<TData, TState>;
	hooks: HookRegistry;
	signals: RunSignals;
	logger: Logger;
};

/**
 * Outcome of a run. `runWorkflow` reports failure by returning, not by
 * throwing.
 */
export type RunOutcome = { state: RunState; error?: unknown };

/**
 * Create the signalling for one run.
 *
 * Both `cancel` and `terminate` abort the same signal; the flags are what tells
 * the two apart afterwards. A bare abort with neither flag set is the case the
 * run loop warns about, because nothing should be able to produce it.
 */
export function createRunSignals(): RunSignals {
	const controller = new AbortController();

	let cancelled = false;
	let terminated = false;

	return {
		signal: controller.signal,
		isCancelled: () => cancelled,
		isTerminated: () => terminated,
		cancel() {
			cancelled = true;
			controller.abort();
		},
		terminate() {
			terminated = true;
			controller.abort();
		},
	};
}

/** Distinguishes "the signal aborted" from a step that resolved with nothing. */
const ABANDONED = Symbol("abandoned");

function whenAborted(signal: AbortSignal): {
	promise: Promise<typeof ABANDONED>;
	dispose: () => void;
} {
	let dispose = () => {};

	const promise = new Promise<typeof ABANDONED>((resolve) => {
		// An already-aborted signal never emits the event, so a step that aborts
		// the run itself would leave this promise pending forever.
		if (signal.aborted) {
			resolve(ABANDONED);
			return;
		}

		const onAbort = () => resolve(ABANDONED);

		signal.addEventListener("abort", onAbort, { once: true });

		// Removed when the step wins the race. Without it a run leaks one listener
		// per step and trips Node's max-listeners warning on a long workflow.
		dispose = () => signal.removeEventListener("abort", onAbort);
	});

	return { promise, dispose };
}

/**
 * Run one step, giving up on it if the signal aborts first.
 *
 * This is the one real divergence from Python. There, `CancelledError` unwinds
 * the step at its next `await`; aborting an `AbortSignal` in Node interrupts
 * nothing, so the step is raced against the signal and abandoned rather than
 * interrupted. That is safe because the process exits immediately afterwards
 * and the subprocess runner kills its process tree on the same signal.
 *
 * @returns whether the step finished.
 */
async function runStep<TData, TState>(
	step: ResolvedWorkflowStep<TData, TState>,
	context: WorkflowContext<TData, TState>,
	signal: AbortSignal,
	logger: Logger,
): Promise<boolean> {
	const running = step.run(context);
	const aborted = whenAborted(signal);

	try {
		const outcome = await Promise.race([running, aborted.promise]);

		if (outcome !== ABANDONED) {
			return true;
		}
	} catch (error) {
		// A step that forwards `context.signal` to an abort-aware API rejects from
		// that API's own abort listener, which `step.run` registered before this
		// one and which therefore runs first. Classifying that as a step failure
		// would report a cancelled job as `error`/`failure` and hide the
		// cancellation, so an abort outranks whatever the step threw.
		if (!signal.aborted) {
			throw error;
		}

		logger.info(
			{ err: error, stepId: step.id },
			"workflow step rejected on abort",
		);

		return false;
	} finally {
		aborted.dispose();
	}

	// The step is still running and cannot be stopped. Its eventual rejection
	// would otherwise be unhandled and take the process down before the failure
	// hooks have finished reporting the run.
	running.catch((err) => {
		logger.warn(
			{ err, stepId: step.id },
			"abandoned workflow step rejected after the run ended",
		);
	});

	logger.info(
		{ stepId: step.id },
		"abandoning workflow step after cancellation or termination",
	);

	return false;
}

/**
 * Run a workflow's steps and report how it ended.
 *
 * Steps run strictly sequentially. The function **returns** its outcome rather
 * than throwing, and never touches the network, `process.exit`, or signal
 * handlers — the job lifecycle loop owns all of that.
 *
 * A rejection from a failure-path hook is logged and swallowed by the registry,
 * so the only way this rejects is a non-failure hook callback throwing. `finish`
 * fires on every path, that one included.
 */
export async function runWorkflow<TData, TState>({
	workflow,
	context,
	hooks,
	signals,
	logger,
}: RunWorkflowOptions<TData, TState>): Promise<RunOutcome> {
	// Initialised to the honest answer for a run that ends before it picks a
	// terminal state, which is what `finish` is told if a hook throws early.
	let state: RunState = "failed";
	let aborted = false;
	let failed = false;
	let error: unknown;

	try {
		await hooks.trigger("workflowStart", undefined);

		try {
			for (const step of workflow.steps) {
				if (signals.signal.aborted) {
					aborted = true;
					break;
				}

				await hooks.trigger("stepStart", { step });

				logger.info(
					{ stepId: step.id, name: step.name },
					"running workflow step",
				);

				if (!(await runStep(step, context, signals.signal, logger))) {
					aborted = true;
					break;
				}

				await hooks.trigger("stepFinish", { step });
			}
		} catch (caught) {
			failed = true;
			error = caught;
		}

		if (aborted) {
			if (signals.isCancelled()) {
				state = "cancelled";

				logger.info("workflow cancelled");

				await hooks.trigger("cancelled", undefined);
			} else {
				state = "failed";

				if (!signals.isTerminated()) {
					logger.warn("workflow terminated without sigterm");
				}

				logger.info("workflow terminated");

				await hooks.trigger("terminated", undefined);
			}

			await hooks.trigger("failure", { state, error });
		} else if (failed) {
			state = "failed";

			logger.error({ err: error }, "workflow failed");

			await hooks.trigger("error", { error });
			await hooks.trigger("failure", { state, error });
		} else {
			state = "succeeded";

			if (workflow.result) {
				await hooks.trigger("result", {
					result: workflow.result(context.state),
				});
			}

			await hooks.trigger("success", undefined);
		}
	} finally {
		await hooks.trigger("finish", { state, error });
	}

	return error === undefined ? { state } : { state, error };
}
