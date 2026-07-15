import { accountQueryOptions } from "@account/account";
import { describe, expect, it } from "vitest";

describe("accountQueryOptions", () => {
	it("does not retry, so an anonymous 401 fails fast instead of stalling", () => {
		expect(accountQueryOptions().retry).toBe(false);
	});
});
