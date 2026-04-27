import { describe, expect, it } from "vitest";
import { WsMessageSchema } from "../schema";

describe("WsMessageSchema", () => {
	it("should accept a valid message", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "update",
			data: { id: "abc123", name: "test" },
		});
		expect(result.success).toBe(true);
	});

	it("should reject a message without interface", () => {
		const result = WsMessageSchema.safeParse({
			operation: "update",
			data: {},
		});
		expect(result.success).toBe(false);
	});

	it("should reject a message without operation", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			data: {},
		});
		expect(result.success).toBe(false);
	});

	it("should reject a message with non-object data", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "update",
			data: "not an object",
		});
		expect(result.success).toBe(false);
	});

	it("should reject a message with array data", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "update",
			data: [1, 2, 3],
		});
		expect(result.success).toBe(false);
	});

	it("should accept a job message with workflow", () => {
		const result = WsMessageSchema.safeParse({
			interface: "jobs",
			operation: "update",
			data: { workflow: "build_index", id: "job1" },
		});
		expect(result.success).toBe(true);
	});

	it("should accept a task message", () => {
		const result = WsMessageSchema.safeParse({
			interface: "tasks",
			operation: "update",
			data: {
				type: "clone_reference",
				id: 1,
				complete: false,
				progress: 50,
			},
		});
		expect(result.success).toBe(true);
	});
});
