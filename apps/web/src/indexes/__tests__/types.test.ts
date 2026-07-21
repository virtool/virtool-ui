import { createFakeIndexMinimal } from "@tests/fake/indexes";
import { describe, expect, it } from "vitest";
import { indexMinimalSchema } from "../types";

describe("indexMinimalSchema", () => {
	it("accepts an index whose change_count is null", () => {
		const index = { ...createFakeIndexMinimal(), change_count: null };

		const parsed = indexMinimalSchema.parse(index);

		expect(parsed.change_count).toBeNull();
	});
});
