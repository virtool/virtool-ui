import { describe, expect, it } from "vitest";
import { getSubtractionFastaName, isJobStateUnsuccessful } from "../utils";

describe("getSubtractionFastaName()", () => {
	it("lowercases and replaces whitespace with underscores", () => {
		expect(getSubtractionFastaName("Arabidopsis thaliana")).toBe(
			"arabidopsis_thaliana.fa.gz",
		);
	});

	it("collapses runs of whitespace", () => {
		expect(getSubtractionFastaName("Foo  \tBar")).toBe("foo_bar.fa.gz");
	});
});

describe("isJobStateUnsuccessful()", () => {
	it.each(["cancelled", "failed"] as const)("is true for %s", (state) => {
		expect(isJobStateUnsuccessful(state)).toBe(true);
	});

	it.each(["pending", "running", "succeeded"] as const)(
		"is false for %s",
		(state) => {
			expect(isJobStateUnsuccessful(state)).toBe(false);
		},
	);

	it("is false when the state is missing", () => {
		expect(isJobStateUnsuccessful(undefined)).toBe(false);
		expect(isJobStateUnsuccessful(null)).toBe(false);
	});
});
