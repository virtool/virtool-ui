import { describe, expect, it } from "vitest";
import { WsMessageSchema } from "../schema";

describe("WsMessageSchema", () => {
	it("accepts a valid message with a numeric id", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "update",
			data: { id: 42 },
		});
		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			interface: "samples",
			operation: "update",
			data: { id: 42 },
		});
	});

	it("accepts a valid message with a string id", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "insert",
			data: { id: "abc123" },
		});
		expect(result.success).toBe(true);
	});

	it("strips unknown fields from data", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "update",
			data: { id: 1, name: "junk" },
		});
		expect(result.success).toBe(true);
		expect(result.data?.data).toEqual({ id: 1 });
	});

	it("rejects messages with an unsupported operation", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "patch",
			data: { id: 1 },
		});
		expect(result.success).toBe(false);
	});

	it("rejects messages without a data.id", () => {
		const result = WsMessageSchema.safeParse({
			interface: "samples",
			operation: "update",
			data: {},
		});
		expect(result.success).toBe(false);
	});

	it("rejects messages without an interface", () => {
		const result = WsMessageSchema.safeParse({
			operation: "update",
			data: { id: 1 },
		});
		expect(result.success).toBe(false);
	});
});
