import { describe, expect, it } from "vitest";
import { LOG_LEVEL_ENV, resolveLevel } from "./config";

describe("resolveLevel", () => {
	it('returns "info" in production when no override is set', () => {
		expect(resolveLevel({ NODE_ENV: "production" })).toBe("info");
	});

	it('returns "debug" outside production when no override is set', () => {
		expect(resolveLevel({ NODE_ENV: "development" })).toBe("debug");
		expect(resolveLevel({})).toBe("debug");
	});

	it("honours a valid VT_LOG_LEVEL override", () => {
		expect(
			resolveLevel({ [LOG_LEVEL_ENV]: "warn", NODE_ENV: "production" }),
		).toBe("warn");
		expect(resolveLevel({ [LOG_LEVEL_ENV]: "trace" })).toBe("trace");
		expect(resolveLevel({ [LOG_LEVEL_ENV]: "silent" })).toBe("silent");
	});

	it("falls back to the env default when VT_LOG_LEVEL is unrecognised", () => {
		expect(
			resolveLevel({ [LOG_LEVEL_ENV]: "verbose", NODE_ENV: "production" }),
		).toBe("info");
		expect(resolveLevel({ [LOG_LEVEL_ENV]: "" })).toBe("debug");
	});
});
