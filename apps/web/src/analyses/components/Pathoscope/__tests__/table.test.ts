import type { PathoscopeHit } from "@virtool/contracts";
import { describe, expect, it } from "vitest";
import { formatPathoscopeHitsAsTsv } from "../table";

function createHit(overrides: Partial<PathoscopeHit>): PathoscopeHit {
	return {
		abbreviation: "TMV",
		align: [],
		coverage: 0.5,
		depth: 12,
		id: "hit",
		isolates: [],
		length: 6000,
		maxDepth: 20,
		maxGenomeLength: 6000,
		name: "Tobacco mosaic virus",
		pi: 0.25,
		version: 3,
		...overrides,
	};
}

describe("formatPathoscopeHitsAsTsv()", () => {
	it("should render a header row and one tab-separated row per hit", () => {
		const table = formatPathoscopeHitsAsTsv(
			[
				createHit({ id: "a", name: "Alpha virus" }),
				createHit({
					coverage: 0.123456,
					depth: 7,
					id: "b",
					name: "Beta virus",
					pi: 0.0001234,
				}),
			],
			{ mappedCount: 1000, showReads: false },
		);

		expect(table).toBe(
			[
				"Name\tWeight\tDepth\tCoverage",
				"Alpha virus\t0.250\t12\t0.500",
				"Beta virus\t1.23E-4\t7\t0.123",
			].join("\n"),
		);
	});

	it("should render read pseudo-counts when reads are shown", () => {
		const table = formatPathoscopeHitsAsTsv(
			[createHit({ name: "Alpha virus", pi: 0.25 })],
			{ mappedCount: 1000, showReads: true },
		);

		expect(table).toBe(
			["Name\tReads\tDepth\tCoverage", "Alpha virus\t250\t12\t0.500"].join(
				"\n",
			),
		);
	});

	it("should render only the header row when nothing is selected", () => {
		expect(
			formatPathoscopeHitsAsTsv([], { mappedCount: 1000, showReads: false }),
		).toBe("Name\tWeight\tDepth\tCoverage");
	});
});
