import type { JsonObject } from "@virtool/contracts";
import type { Logger } from "@virtool/logger";
import type { RunState } from "./run";
import type { WorkflowStepMetadata } from "./step";

/**
 * The payload each lifecycle hook's callbacks receive.
 *
 * A hook with nothing to say carries `undefined` rather than `void`, so its
 * callers still have to pass an argument and cannot pass the wrong one.
 */
export type HookPayloads = {
	workflowStart: undefined;
	stepStart: { step: WorkflowStepMetadata };
	stepFinish: { step: WorkflowStepMetadata };
	result: { result: JsonObject };
	success: undefined;
	cancelled: undefined;
	error: { error: unknown };
	terminated: undefined;
	failure: { state: RunState; error?: unknown };
	finish: { state: RunState; error?: unknown };
};

/** A point in the workflow lifecycle a callback can be attached to. */
export type HookName = keyof HookPayloads;

/**
 * The hooks fired when a run has already failed.
 *
 * A rejection from one of these is logged and swallowed. Python does not do
 * this, and a throwing `on_failure` callback there escapes `execute()` and
 * loses the original failure — the one thing the run was still trying to
 * report.
 */
const FAILURE_HOOKS: ReadonlySet<HookName> = new Set<HookName>([
	"error",
	"cancelled",
	"terminated",
	"failure",
	"finish",
]);

// The registry stores callbacks for every hook in one map, so a stored callback
// cannot be typed against the specific payload it was registered for. The two
// casts below are where that is reconciled; `on` and `trigger` keep the
// relationship in their own signatures, which is what call sites see.
type StoredHookCallback = (payload: never) => void | Promise<void>;

/**
 * Per-run hook registry. Created fresh for each run — never a module singleton.
 *
 * Python's hooks are module singletons, which forced a
 * `cleanup_builtin_status_hooks()` call between runs and a standing TODO about
 * isolating hooks to a run. A registry created per run removes both.
 */
export type HookRegistry = {
	on<N extends HookName>(
		name: N,
		callback: (payload: HookPayloads[N]) => void | Promise<void>,
	): void;
	trigger<N extends HookName>(name: N, payload: HookPayloads[N]): Promise<void>;
};

/**
 * Create a hook registry bound to one run.
 *
 * Callbacks on a single hook run **concurrently** and in no order relative to
 * each other, matching Python's `asyncio.gather`. Registration order is not a
 * sequencing tool; anything that must happen after something else belongs in
 * the same callback.
 */
export function createHookRegistry(logger: Logger): HookRegistry {
	const callbacks = new Map<HookName, StoredHookCallback[]>();

	return {
		on(name, callback) {
			const registered = callbacks.get(name);

			if (registered) {
				registered.push(callback as StoredHookCallback);
				return;
			}

			callbacks.set(name, [callback as StoredHookCallback]);
		},

		async trigger(name, payload) {
			const registered = callbacks.get(name);

			if (!registered || registered.length === 0) {
				return;
			}

			const settled = await Promise.allSettled(
				registered.map((callback) =>
					(callback as (value: unknown) => void | Promise<void>)(payload),
				),
			);

			const rejections = settled
				.filter((result) => result.status === "rejected")
				.map((result) => result.reason);

			if (rejections.length === 0) {
				return;
			}

			if (FAILURE_HOOKS.has(name)) {
				for (const err of rejections) {
					logger.error({ err, hook: name }, "workflow hook callback failed");
				}

				return;
			}

			// A failing `success` callback means the job was never marked finished.
			// Swallowing that would report a job as complete that the control plane
			// still believes is running.
			throw rejections[0];
		},
	};
}
