import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { useSortAndFilterPathoscopeHits } from "@analyses/hooks";
import type { FormattedPathoscopeAnalysis } from "@analyses/types";
import { renderHook } from "@testing-library/react";
import type { PathoscopeHit } from "@virtool/contracts";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

function createHit(overrides: Partial<PathoscopeHit>): PathoscopeHit {
	return {
		abbreviation: "",
		align: [],
		coverage: 0,
		depth: 0,
		id: "otu",
		isolates: [],
		length: 100,
		maxDepth: 0,
		maxGenomeLength: 100,
		name: "OTU",
		pi: 0,
		version: 1,
		...overrides,
	};
}

// Three hits whose coverage, depth and weight each rank them differently, so a
// sort that reads the wrong field cannot accidentally produce the right order.
const hits = [
	createHit({ id: "a", name: "A", coverage: 0.1, depth: 30, pi: 0.5 }),
	createHit({ id: "b", name: "B", coverage: 0.9, depth: 10, pi: 0.2 }),
	createHit({ id: "c", name: "C", coverage: 0.5, depth: 20, pi: 0.9 }),
];

function renderSort(sort?: string, sortDesc?: boolean) {
	const analysis = {
		results: { hits, readCount: 1000, subtractedCount: 0 },
	} as FormattedPathoscopeAnalysis;

	function wrapper({ children }: { children: ReactNode }) {
		return (
			<AnalysisSearchProvider search={{ sort, sortDesc }} setSearch={vi.fn()}>
				{children}
			</AnalysisSearchProvider>
		);
	}

	// A read length of zero would make the OTU filter's threshold infinite, so
	// pass a realistic one. `filterOtus` is off here regardless.
	const { result } = renderHook(
		() => useSortAndFilterPathoscopeHits(analysis, 150),
		{ wrapper },
	);

	return result.current.map((hit) => hit.id);
}

describe("useSortAndFilterPathoscopeHits()", () => {
	it("should sort by weight, which is the hit's pi", () => {
		// The toolbar labels `pi` "Weight" and puts that word in the URL, so the
		// key it emits is not a field on the hit.
		expect(renderSort("weight")).toEqual(["b", "a", "c"]);
		expect(renderSort("weight", true)).toEqual(["c", "a", "b"]);
	});

	it("should sort by coverage", () => {
		expect(renderSort("coverage")).toEqual(["a", "c", "b"]);
	});

	it("should sort by depth", () => {
		expect(renderSort("depth")).toEqual(["b", "c", "a"]);
	});

	it("should sort by coverage when no key has been chosen", () => {
		// The toolbar shows Coverage as the default, so an untouched list has to be
		// in the order it claims.
		expect(renderSort(undefined, true)).toEqual(["b", "c", "a"]);
	});
});
