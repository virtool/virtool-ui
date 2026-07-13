import { describe, expect, it } from "vitest";
import { userQueryKeys } from "../queries";

function startsWith(key: readonly unknown[], prefix: readonly unknown[]) {
	return prefix.every((segment, index) => key[index] === segment);
}

describe("userQueryKeys", () => {
	it("nests every list variant under lists(), so one invalidation covers them all", () => {
		for (const key of [
			userQueryKeys.list([1, 25, "", undefined, undefined]),
			userQueryKeys.nested(),
			userQueryKeys.infiniteLists(),
			userQueryKeys.infiniteList([25, ""]),
		]) {
			expect(startsWith(key, userQueryKeys.lists())).toBe(true);
		}
	});

	it("nests details under details()", () => {
		expect(startsWith(userQueryKeys.detail(7), userQueryKeys.details())).toBe(
			true,
		);
	});

	it("nests lists and details under all()", () => {
		expect(startsWith(userQueryKeys.lists(), userQueryKeys.all())).toBe(true);
		expect(startsWith(userQueryKeys.details(), userQueryKeys.all())).toBe(true);
	});

	it("gives the nested list its own key rather than colliding with lists()", () => {
		expect(userQueryKeys.nested()).not.toEqual(userQueryKeys.lists());
	});

	it("distinguishes filter sets", () => {
		expect(userQueryKeys.list([1, 25, ""])).not.toEqual(
			userQueryKeys.list([2, 25, ""]),
		);
	});
});
