import { describe, expect, it } from "vitest";
import { eventToWsMessage } from "./broadcast";

describe("eventToWsMessage", () => {
	it("maps create to insert with the resource id", () => {
		expect(
			eventToWsMessage({
				domain: "labels",
				resource_id: 4,
				operation: "create",
			}),
		).toEqual({
			interface: "labels",
			operation: "insert",
			data: { id: 4 },
		});
	});

	it("maps update to update with the resource id", () => {
		expect(
			eventToWsMessage({
				domain: "labels",
				resource_id: 5,
				operation: "update",
			}),
		).toEqual({
			interface: "labels",
			operation: "update",
			data: { id: 5 },
		});
	});

	it("maps delete to delete with the resource id", () => {
		expect(
			eventToWsMessage({
				domain: "labels",
				resource_id: 9,
				operation: "delete",
			}),
		).toEqual({
			interface: "labels",
			operation: "delete",
			data: { id: 9 },
		});
	});

	it("preserves string resource ids", () => {
		expect(
			eventToWsMessage({
				domain: "samples",
				resource_id: "abc",
				operation: "create",
			}),
		).toEqual({
			interface: "samples",
			operation: "insert",
			data: { id: "abc" },
		});
	});
});
