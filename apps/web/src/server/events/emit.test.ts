import { beforeEach, describe, expect, it, vi } from "vitest";

const notify = vi.fn().mockResolvedValue(undefined);

vi.mock("../db/pg", () => ({
	client: { notify },
	db: {},
}));

vi.mock("../logger", () => ({
	logger: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

const { emit } = await import("./emit");

beforeEach(() => {
	notify.mockClear();
});

describe("emit", () => {
	it("publishes a create event with the python-compatible payload", async () => {
		await emit("labels", 7, "create");

		expect(notify).toHaveBeenCalledTimes(1);
		const [channel, payload] = notify.mock.calls[0] ?? [];
		expect(channel).toBe("client_events");
		expect(JSON.parse(payload)).toEqual({
			domain: "labels",
			resource_id: 7,
			operation: "create",
		});
	});

	it("publishes a delete event", async () => {
		await emit("labels", 12, "delete");

		const [, payload] = notify.mock.calls[0] ?? [];
		expect(JSON.parse(payload).operation).toBe("delete");
	});

	it("accepts string resource ids", async () => {
		await emit("samples", "abc123", "update");

		const [, payload] = notify.mock.calls[0] ?? [];
		expect(JSON.parse(payload).resource_id).toBe("abc123");
	});
});
