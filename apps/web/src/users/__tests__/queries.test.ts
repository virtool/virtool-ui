import { describe, expect, it } from "vitest";
import { userQueryKeys } from "../queries";

function startsWith(key: readonly unknown[], prefix: readonly unknown[]) {
	return prefix.every((segment, index) => key[index] === segment);
}

describe("userQueryKeys", () => {
	it("nests the nested list under lists(), so one invalidation covers it too", () => {
		expect(startsWith(userQueryKeys.nested(), userQueryKeys.lists())).toBe(
			true,
		);
	});

	it("gives the nested list its own key rather than colliding with lists()", () => {
		expect(userQueryKeys.nested()).not.toEqual(userQueryKeys.lists());
	});
});
