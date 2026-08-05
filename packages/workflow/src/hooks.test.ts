import { describe, expect, it } from "vitest";
import { createHookRegistry, type HookName } from "./hooks";
import { createRecordingLogger } from "./testFixtures";

function deferred(): { promise: Promise<void>; resolve: () => void } {
	let resolve = () => {};

	const promise = new Promise<void>((settle) => {
		resolve = () => settle();
	});

	return { promise, resolve };
}

describe("createHookRegistry", () => {
	it("invokes every callback registered on a hook", async () => {
		const hooks = createHookRegistry(createRecordingLogger().logger);
		const called: string[] = [];

		hooks.on("workflowStart", () => {
			called.push("first");
		});
		hooks.on("workflowStart", () => {
			called.push("second");
		});

		await hooks.trigger("workflowStart", undefined);

		expect(called.sort()).toEqual(["first", "second"]);
	});

	it("does nothing for a hook with no callbacks", async () => {
		const hooks = createHookRegistry(createRecordingLogger().logger);

		await expect(hooks.trigger("success", undefined)).resolves.toBeUndefined();
	});

	it("passes the payload to the callback", async () => {
		const hooks = createHookRegistry(createRecordingLogger().logger);
		const seen: unknown[] = [];

		hooks.on("stepStart", (payload) => {
			seen.push(payload.step.id);
		});

		await hooks.trigger("stepStart", {
			step: { id: "map_reads", name: "Map Reads", description: "Map." },
		});

		expect(seen).toEqual(["map_reads"]);
	});

	// Registration order binds the callbacks but does not sequence them: both
	// start before either finishes, matching Python's `asyncio.gather`.
	it("runs callbacks on one hook concurrently", async () => {
		const hooks = createHookRegistry(createRecordingLogger().logger);
		const gate = deferred();
		const started: string[] = [];

		hooks.on("workflowStart", async () => {
			started.push("first");
			await gate.promise;
		});
		hooks.on("workflowStart", async () => {
			started.push("second");
		});

		const triggered = hooks.trigger("workflowStart", undefined);

		await Promise.resolve();

		expect(started).toEqual(["first", "second"]);

		gate.resolve();

		await triggered;
	});

	it.each<HookName>(["error", "cancelled", "terminated", "failure", "finish"])(
		"logs and swallows a rejection from the %s hook",
		async (name) => {
			const recording = createRecordingLogger();
			const hooks = createHookRegistry(recording.logger);

			hooks.on(name, () => Promise.reject(new Error("callback exploded")));

			await expect(
				hooks.trigger(name, { state: "failed" } as never),
			).resolves.toBeUndefined();

			const record = recording
				.records()
				.find((entry) => entry.msg === "workflow hook callback failed");

			expect(record).toBeDefined();
			expect(record?.hook).toBe(name);
		},
	);

	it.each<HookName>([
		"workflowStart",
		"stepStart",
		"stepFinish",
		"result",
		"success",
	])("propagates a rejection from the %s hook", async (name) => {
		const hooks = createHookRegistry(createRecordingLogger().logger);

		hooks.on(name, () => Promise.reject(new Error("callback exploded")));

		await expect(hooks.trigger(name, undefined as never)).rejects.toThrow(
			"callback exploded",
		);
	});

	it("still runs the other callbacks when one rejects", async () => {
		const recording = createRecordingLogger();
		const hooks = createHookRegistry(recording.logger);
		const called: string[] = [];

		hooks.on("finish", () => Promise.reject(new Error("callback exploded")));
		hooks.on("finish", () => {
			called.push("survivor");
		});

		await hooks.trigger("finish", { state: "failed" });

		expect(called).toEqual(["survivor"]);
	});
});
