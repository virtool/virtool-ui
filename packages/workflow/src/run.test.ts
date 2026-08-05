import { afterEach, describe, expect, it } from "vitest";
import { createHookRegistry, type HookName, type HookRegistry } from "./hooks";
import {
	createRunSignals,
	type RunOutcome,
	type RunSignals,
	runWorkflow,
} from "./run";
import { defineWorkflow, type WorkflowStep } from "./step";
import { createFakeContext, createRecordingLogger } from "./testFixtures";

const HOOK_NAMES: HookName[] = [
	"workflowStart",
	"stepStart",
	"stepFinish",
	"result",
	"success",
	"cancelled",
	"error",
	"terminated",
	"failure",
	"finish",
];

type Data = { referenceId: string };
type State = { visited: string[] };

type Deferred = {
	promise: Promise<void>;
	resolve: () => void;
	reject: (error: Error) => void;
};

function deferred(): Deferred {
	let resolve = () => {};
	let reject = (_error: Error) => {};

	const promise = new Promise<void>((settle, fail) => {
		resolve = () => settle();
		reject = fail;
	});

	return { promise, resolve, reject };
}

/** A step that records that it ran. */
function visitStep(id: string): WorkflowStep<Data, State> {
	return {
		id,
		description: `Run ${id}.`,
		run: async (context) => {
			context.state.visited.push(id);
		},
	};
}

/** A step that throws. */
function throwingStep(id: string, error: Error): WorkflowStep<Data, State> {
	return {
		id,
		description: `Run ${id}.`,
		run: async () => {
			throw error;
		},
	};
}

type Harness = {
	/** Every hook the run loop fired, in order. */
	sequence: string[];
	context: ReturnType<typeof createFakeContext<Data, State>>;
	hooks: HookRegistry;
	records: () => Array<Record<string, unknown>>;
	logged: (message: string) => boolean;
	run: () => Promise<RunOutcome>;
};

/**
 * Build a run over `steps`, driven by `signals`.
 *
 * The signals are taken rather than created here because the context has to
 * carry the same `AbortSignal` the run loop races against, the way
 * `createWorkflowContext` wires it in production. A context holding a second,
 * unrelated signal would hide every bug in how a step reacts to its own
 * cancellation.
 */
function setup(
	signals: RunSignals,
	steps: WorkflowStep<Data, State>[],
	result?: (state: State) => { visited: string[] },
): Harness {
	const recording = createRecordingLogger();
	const hooks = createHookRegistry(recording.logger);
	const sequence: string[] = [];

	for (const name of HOOK_NAMES) {
		hooks.on(name, () => {
			sequence.push(name);
		});
	}

	const workflow = defineWorkflow<Data, State>({
		name: "pathoscope",
		buildContext: async () => ({ referenceId: "ref" }),
		createState: () => ({ visited: [] }),
		steps,
		result,
	});

	const context = createFakeContext<Data, State>(
		{ referenceId: "ref" },
		{ visited: [] },
		{ signal: signals.signal },
	);

	return {
		sequence,
		context,
		hooks,
		records: recording.records,
		logged: (message) =>
			recording.records().some((record) => record.msg === message),
		run: () =>
			runWorkflow({
				workflow,
				context,
				hooks,
				signals,
				logger: recording.logger,
			}),
	};
}

/**
 * Signalling that aborts without either flag set.
 *
 * `createRunSignals` cannot produce this — both its methods set a flag — which
 * is exactly why the run loop warns when it sees it.
 */
function createUnflaggedSignals(): RunSignals & { abort: () => void } {
	const controller = new AbortController();

	return {
		signal: controller.signal,
		isCancelled: () => false,
		isTerminated: () => false,
		cancel: () => {},
		terminate: () => {},
		abort: () => controller.abort(),
	};
}

describe("createRunSignals", () => {
	it("reports neither flag before anything happens", () => {
		const signals = createRunSignals();

		expect(signals.signal.aborted).toBe(false);
		expect(signals.isCancelled()).toBe(false);
		expect(signals.isTerminated()).toBe(false);
	});

	it("aborts and flags cancellation", () => {
		const signals = createRunSignals();

		signals.cancel();

		expect(signals.signal.aborted).toBe(true);
		expect(signals.isCancelled()).toBe(true);
		expect(signals.isTerminated()).toBe(false);
	});

	it("aborts and flags termination", () => {
		const signals = createRunSignals();

		signals.terminate();

		expect(signals.signal.aborted).toBe(true);
		expect(signals.isTerminated()).toBe(true);
		expect(signals.isCancelled()).toBe(false);
	});
});

describe("runWorkflow", () => {
	it("runs every step in order and succeeds", async () => {
		const harness = setup(createRunSignals(), [
			visitStep("first"),
			visitStep("second"),
		]);

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "succeeded" });
		expect(harness.context.state.visited).toEqual(["first", "second"]);
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"stepFinish",
			"stepStart",
			"stepFinish",
			"success",
			"finish",
		]);
	});

	it("logs each step it runs", async () => {
		const harness = setup(createRunSignals(), [visitStep("map_reads")]);

		await harness.run();

		const record = harness
			.records()
			.find((entry) => entry.msg === "running workflow step");

		expect(record?.stepId).toBe("map_reads");
		expect(record?.name).toBe("Map Reads");
	});

	it("fires result before success when the workflow declares one", async () => {
		const harness = setup(
			createRunSignals(),
			[visitStep("first")],
			(state) => ({
				visited: state.visited,
			}),
		);
		const results: unknown[] = [];

		harness.hooks.on("result", (payload) => {
			results.push(payload.result);
		});

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "succeeded" });
		expect(results).toEqual([{ visited: ["first"] }]);
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"stepFinish",
			"result",
			"success",
			"finish",
		]);
	});

	it("reports a step that throws as a failure without rethrowing", async () => {
		const failure = new Error("bowtie2 exited 1");
		const harness = setup(createRunSignals(), [
			throwingStep("map_reads", failure),
			visitStep("never_runs"),
		]);

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "failed", error: failure });
		expect(harness.context.state.visited).toEqual([]);
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"error",
			"failure",
			"finish",
		]);
	});

	it("carries the error on the error, failure and finish payloads", async () => {
		const failure = new Error("bowtie2 exited 1");
		const harness = setup(createRunSignals(), [
			throwingStep("map_reads", failure),
		]);
		const payloads: unknown[] = [];

		harness.hooks.on("error", (payload) => {
			payloads.push(payload.error);
		});
		harness.hooks.on("failure", (payload) => {
			payloads.push(payload);
		});
		harness.hooks.on("finish", (payload) => {
			payloads.push(payload);
		});

		await harness.run();

		expect(payloads).toEqual([
			failure,
			{ state: "failed", error: failure },
			{ state: "failed", error: failure },
		]);
	});

	it("reports cancellation when the cancelled flag is set", async () => {
		const signals = createRunSignals();
		const gate = deferred();
		const harness = setup(signals, [
			{
				id: "long_step",
				description: "Take a while.",
				run: async () => {
					signals.cancel();
					await gate.promise;
				},
			},
			visitStep("never_runs"),
		]);

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "cancelled" });
		expect(harness.context.state.visited).toEqual([]);
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"cancelled",
			"failure",
			"finish",
		]);
		expect(harness.logged("workflow cancelled")).toBe(true);

		gate.resolve();
	});

	it("reports termination as a failure", async () => {
		const signals = createRunSignals();
		const gate = deferred();
		const harness = setup(signals, [
			{
				id: "long_step",
				description: "Take a while.",
				run: async () => {
					signals.terminate();
					await gate.promise;
				},
			},
		]);

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "failed" });
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"terminated",
			"failure",
			"finish",
		]);
		expect(harness.logged("workflow terminated without sigterm")).toBe(false);

		gate.resolve();
	});

	// Nothing should be able to abort without setting a flag, which is why the
	// run loop says so rather than silently reporting a plain termination.
	it("warns when the run aborts with neither flag set", async () => {
		const signals = createUnflaggedSignals();
		const gate = deferred();
		const harness = setup(signals, [
			{
				id: "long_step",
				description: "Take a while.",
				run: async () => {
					signals.abort();
					await gate.promise;
				},
			},
		]);

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "failed" });
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"terminated",
			"failure",
			"finish",
		]);
		expect(harness.logged("workflow terminated without sigterm")).toBe(true);

		gate.resolve();
	});

	// A step forwarding `context.signal` to an abort-aware API rejects from that
	// API's abort listener, which is registered inside the step and so runs
	// before the run loop's own. The rejection must not be read as a step
	// failure, or a cancelled job reports `error`/`failure` and the cancellation
	// disappears.
	it("reports a step that rejects on abort as cancellation", async () => {
		const signals = createRunSignals();
		const started = deferred();
		const harness = setup(signals, [
			{
				id: "abort_aware_step",
				description: "Reject when the signal aborts.",
				run: (context) =>
					new Promise((_resolve, reject) => {
						context.signal.addEventListener("abort", () => {
							reject(new Error("This operation was aborted"));
						});
						started.resolve();
					}),
			},
		]);

		const running = harness.run();

		await started.promise;

		signals.cancel();

		const outcome = await running;

		expect(outcome).toEqual({ state: "cancelled" });
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"cancelled",
			"failure",
			"finish",
		]);
		expect(harness.logged("workflow step rejected on abort")).toBe(true);
	});

	it("still reports a step that rejects without an abort as a failure", async () => {
		const failure = new Error("bowtie2 exited 1");
		const harness = setup(createRunSignals(), [
			throwingStep("map_reads", failure),
		]);

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "failed", error: failure });
	});

	it("checks the signal before starting each step", async () => {
		const signals = createRunSignals();
		const harness = setup(signals, [
			visitStep("first"),
			visitStep("never_runs"),
		]);

		harness.hooks.on("stepFinish", () => {
			signals.cancel();
		});

		const outcome = await harness.run();

		expect(outcome).toEqual({ state: "cancelled" });
		expect(harness.context.state.visited).toEqual(["first"]);
		expect(harness.sequence).toEqual([
			"workflowStart",
			"stepStart",
			"stepFinish",
			"cancelled",
			"failure",
			"finish",
		]);
	});

	it("fires finish even when a failure callback rejects", async () => {
		const harness = setup(createRunSignals(), [
			throwingStep("map_reads", new Error("bowtie2 exited 1")),
		]);

		harness.hooks.on("failure", () =>
			Promise.reject(new Error("reporting failed")),
		);

		const outcome = await harness.run();

		expect(outcome.state).toBe("failed");
		expect(harness.sequence).toContain("finish");
	});

	// A failing `success` callback means the job was never marked finished. It
	// must not be silent, so it comes out as a rejection — but `finish` still
	// fires first.
	it("rejects when a success callback rejects, after firing finish", async () => {
		const harness = setup(createRunSignals(), [visitStep("first")]);

		harness.hooks.on("success", () =>
			Promise.reject(new Error("finish call failed")),
		);

		await expect(harness.run()).rejects.toThrow("finish call failed");

		expect(harness.sequence).toContain("finish");
	});
});

describe("runWorkflow cancellation of an in-flight step", () => {
	const rejections: unknown[] = [];

	function onUnhandledRejection(reason: unknown) {
		rejections.push(reason);
	}

	afterEach(() => {
		process.off("unhandledRejection", onUnhandledRejection);
		rejections.length = 0;
	});

	it("abandons the step without waiting, and swallows its later rejection", async () => {
		process.on("unhandledRejection", onUnhandledRejection);

		const signals = createRunSignals();
		const started = deferred();
		const gate = deferred();
		let finished = false;

		const harness = setup(signals, [
			{
				id: "long_step",
				description: "Take a while.",
				run: async () => {
					started.resolve();
					await gate.promise;
					finished = true;
				},
			},
		]);

		const running = harness.run();

		await started.promise;

		signals.cancel();

		const outcome = await running;

		expect(outcome).toEqual({ state: "cancelled" });
		expect(finished).toBe(false);

		// The abandoned step keeps running and eventually fails. Nothing is
		// awaiting it any more, so without the catch the run loop attaches, this
		// would take the process down before the failure hooks finished.
		gate.reject(new Error("bowtie2 killed"));

		// Node fires `unhandledRejection` once the microtask queue drains, so a
		// timer is what gives it the chance to. Waiting on the log line instead
		// would assert the catch ran rather than that nothing escaped it.
		await new Promise((resolve) => {
			setTimeout(resolve, 20);
		});

		expect(rejections).toEqual([]);
		expect(
			harness.logged("abandoned workflow step rejected after the run ended"),
		).toBe(true);
	});
});
