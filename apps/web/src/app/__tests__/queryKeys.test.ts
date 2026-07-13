import { describe, expect, it } from "vitest";
import { createQueryKeys } from "../queryKeys";

function startsWith(key: readonly unknown[], prefix: readonly unknown[]) {
	return prefix.every((segment, index) => key[index] === segment);
}

describe("createQueryKeys", () => {
	const keys = createQueryKeys("samples");

	it("roots every key at the domain", () => {
		expect(keys.all()).toEqual(["samples"]);
		for (const key of [
			keys.lists(),
			keys.list([1, 25]),
			keys.infiniteLists(),
			keys.infiniteList([25]),
			keys.details(),
			keys.detail("abc"),
		]) {
			expect(startsWith(key, keys.all())).toBe(true);
		}
	});

	it("nests every list variant under lists(), so one invalidation covers them all", () => {
		for (const key of [
			keys.list([1, 25, ""]),
			keys.infiniteLists(),
			keys.infiniteList([25, ""]),
		]) {
			expect(startsWith(key, keys.lists())).toBe(true);
		}
	});

	it("nests details under details()", () => {
		expect(startsWith(keys.detail("abc"), keys.details())).toBe(true);
		expect(startsWith(keys.detail(7), keys.details())).toBe(true);
	});

	it("keeps lists and details in separate namespaces", () => {
		expect(startsWith(keys.details(), keys.lists())).toBe(false);
		expect(startsWith(keys.lists(), keys.details())).toBe(false);
	});

	it("distinguishes filter sets", () => {
		expect(keys.list([1, 25, ""])).not.toEqual(keys.list([2, 25, ""]));
		expect(keys.infiniteList([25, "a"])).not.toEqual(
			keys.infiniteList([25, "b"]),
		);
	});

	it("keeps paginated and infinite lists apart", () => {
		expect(keys.list([25, ""])).not.toEqual(keys.infiniteList([25, ""]));
	});

	it("keeps domains apart", () => {
		expect(createQueryKeys("users").all()).not.toEqual(keys.all());
	});
});
