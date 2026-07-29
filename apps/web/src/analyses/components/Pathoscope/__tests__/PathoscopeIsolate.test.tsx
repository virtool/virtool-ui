import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import type {
	PathoscopeSegmentCoverage,
	PathoscopeSequence,
} from "@virtool/contracts";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import PathoscopeIsolate from "../PathoscopeIsolate";

function segment(
	key: string,
	length: number,
	name: string | null,
	detected = true,
): PathoscopeSegmentCoverage {
	return { align: [], detected, key, length, name };
}

function sequence(
	segmentKey: string,
	accession: string,
	length: number,
): PathoscopeSequence {
	return {
		accession,
		align: [],
		best: 10,
		coverage: 1,
		definition: `${accession} definition`,
		id: accession,
		length,
		pi: 0.5,
		reads: 20,
		segmentKey,
	};
}

const segments = [
	segment("seg:L", 8900, "L"),
	segment("seg:M", 4800, "M"),
	segment("seg:S", 2900, "S"),
];

const genomeLength = 16_600;

function render(children: ReactNode) {
	renderWithProviders(
		<AnalysisSearchProvider search={{}} setSearch={vi.fn()}>
			{children}
		</AnalysisSearchProvider>,
	);
}

function renderIsolate(sequences: PathoscopeSequence[]) {
	render(
		<PathoscopeIsolate
			coverage={0.9}
			depth={12}
			genomeLength={genomeLength}
			maxDepth={20}
			name="Isolate A"
			pi={0.5}
			reads={30}
			segments={segments}
			sequences={sequences}
		/>,
	);
}

describe("<PathoscopeIsolate />", () => {
	it("should render a chart for every segment the isolate carries", () => {
		renderIsolate([
			sequence("seg:L", "NC_L", 8900),
			sequence("seg:M", "NC_M", 4800),
			sequence("seg:S", "NC_S", 2900),
		]);

		expect(screen.getAllByRole("img")).toHaveLength(3);
		expect(screen.queryByText("Not in this isolate")).toBeNull();
	});

	it("should hold the column open for a segment the isolate does not carry", () => {
		// No M sequence. The column has to stay in place, or L and S would read as
		// though they were the isolate's first two segments.
		renderIsolate([
			sequence("seg:L", "NC_L", 8900),
			sequence("seg:S", "NC_S", 2900),
		]);

		expect(screen.getAllByRole("img")).toHaveLength(2);
		expect(screen.getByText("Not in this isolate")).toBeVisible();

		// The empty column is labelled with the segment it stands for, so it is not
		// mistaken for a segment that was measured and found empty.
		expect(screen.getByText("M")).toBeVisible();
	});

	it("should not claim the isolate lacks a segment nothing mapped to", () => {
		// Every isolate is empty on a segment no hit was recorded against, and the
		// reference may well describe it for all of them — so the column must not say
		// this isolate does not carry it.
		renderWithProviders(
			<AnalysisSearchProvider search={{}} setSearch={vi.fn()}>
				<PathoscopeIsolate
					coverage={0.9}
					depth={12}
					genomeLength={genomeLength}
					maxDepth={20}
					name="Isolate A"
					pi={0.5}
					reads={30}
					segments={[
						segment("seg:L", 8900, "L"),
						segment("seg:M", 4800, "M", false),
					]}
					sequences={[sequence("seg:L", "NC_L", 8900)]}
				/>
			</AnalysisSearchProvider>,
		);

		expect(screen.getByText("No reads mapped")).toBeVisible();
		expect(screen.queryByText("Not in this isolate")).toBeNull();
	});

	it("should lay the columns out in the order the segments are given in", () => {
		renderIsolate([
			sequence("seg:S", "NC_S", 2900),
			sequence("seg:L", "NC_L", 8900),
			sequence("seg:M", "NC_M", 4800),
		]);

		// The isolate's own sequence order does not decide the layout — the OTU's
		// segments do, so every isolate's columns line up.
		expect(
			screen.getAllByRole("img").map((svg) => svg.getAttribute("aria-label")),
		).toEqual([
			expect.stringContaining("NC_L"),
			expect.stringContaining("NC_M"),
			expect.stringContaining("NC_S"),
		]);
	});

	it("should render nothing but the heading for an isolate with no segments", () => {
		render(
			<PathoscopeIsolate
				coverage={0}
				depth={0}
				genomeLength={0}
				maxDepth={0}
				name="Isolate A"
				pi={0}
				reads={0}
				segments={[]}
				sequences={[]}
			/>,
		);

		expect(screen.queryAllByRole("img")).toHaveLength(0);
		expect(screen.getByText("Isolate A")).toBeVisible();
	});
});
