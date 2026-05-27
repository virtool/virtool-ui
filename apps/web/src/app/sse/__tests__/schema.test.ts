import { describe, expect, it } from "vitest";
import { SseMessageSchema } from "../schema";

describe("SseMessageSchema", () => {
	it("accepts a valid message with a numeric id", () => {
		const result = SseMessageSchema.safeParse({
			domain: "samples",
			operation: "update",
			id: 42,
		});
		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			domain: "samples",
			operation: "update",
			id: 42,
		});
	});

	it("accepts a valid message with a string id", () => {
		const result = SseMessageSchema.safeParse({
			domain: "samples",
			operation: "insert",
			id: "abc123",
		});
		expect(result.success).toBe(true);
	});

	it("strips unknown fields", () => {
		const result = SseMessageSchema.safeParse({
			domain: "samples",
			operation: "update",
			id: 1,
			extra: "junk",
		});
		expect(result.success).toBe(true);
		expect(result.data).toEqual({
			domain: "samples",
			operation: "update",
			id: 1,
		});
	});

	it("rejects messages with an unsupported operation", () => {
		const result = SseMessageSchema.safeParse({
			domain: "samples",
			operation: "patch",
			id: 1,
		});
		expect(result.success).toBe(false);
	});

	it("rejects messages without an id", () => {
		const result = SseMessageSchema.safeParse({
			domain: "samples",
			operation: "update",
		});
		expect(result.success).toBe(false);
	});

	it("rejects messages without a domain", () => {
		const result = SseMessageSchema.safeParse({
			operation: "update",
			id: 1,
		});
		expect(result.success).toBe(false);
	});
});
