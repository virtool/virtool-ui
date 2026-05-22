import { beforeEach, describe, expect, it, vi } from "vitest";
import { LabelNotFoundError } from "../labels/data";

const getLabel = vi.fn();

vi.mock("../labels/data", async () => {
	const actual =
		await vi.importActual<typeof import("../labels/data")>("../labels/data");
	return {
		...actual,
		getLabel: (...args: unknown[]) => getLabel(...args),
	};
});

vi.mock("../logger", () => ({
	logger: { debug: vi.fn(), error: vi.fn(), info: vi.fn(), warn: vi.fn() },
}));

const { eventToWsMessage } = await import("./broadcast");

beforeEach(() => {
	getLabel.mockReset();
});

describe("eventToWsMessage", () => {
	it("maps create to insert with the resolved resource", async () => {
		const label = {
			id: 4,
			name: "wip",
			color: "#fff",
			description: "",
			count: 0,
		};
		getLabel.mockResolvedValueOnce(label);

		const message = await eventToWsMessage({
			domain: "labels",
			resource_id: 4,
			operation: "create",
		});

		expect(message).toEqual({
			interface: "labels",
			operation: "insert",
			data: label,
		});
	});

	it("maps update to update with the resolved resource", async () => {
		const label = {
			id: 5,
			name: "x",
			color: "#000",
			description: "",
			count: 2,
		};
		getLabel.mockResolvedValueOnce(label);

		const message = await eventToWsMessage({
			domain: "labels",
			resource_id: 5,
			operation: "update",
		});

		expect(message?.operation).toBe("update");
		expect(message?.data).toBe(label);
	});

	it("emits delete with the id in a record, without fetching", async () => {
		const message = await eventToWsMessage({
			domain: "labels",
			resource_id: 9,
			operation: "delete",
		});

		expect(message).toEqual({
			interface: "labels",
			operation: "delete",
			data: { id: 9 },
		});
		expect(getLabel).not.toHaveBeenCalled();
	});

	it("returns null for unknown domains so the legacy ws path delivers them", async () => {
		const message = await eventToWsMessage({
			domain: "samples",
			resource_id: "abc",
			operation: "create",
		});

		expect(message).toBeNull();
		expect(getLabel).not.toHaveBeenCalled();
	});

	it("returns null when a resource was deleted between event and resolve", async () => {
		getLabel.mockRejectedValueOnce(new LabelNotFoundError());

		const message = await eventToWsMessage({
			domain: "labels",
			resource_id: 99,
			operation: "update",
		});

		expect(message).toBeNull();
	});
});
