import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import type {
	PathoscopeSegmentCoverage,
	PathoscopeSequence,
} from "@virtool/contracts";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import PathoscopeIsolate from "../PathoscopeIsolate";

/**
 * jsdom does not lay out elements, so `offsetWidth` is always zero. The chart
 * measures its container to size the area, so stub a realistic width.
 */
function mockElementWidth(width: number) {
	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
}

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
		align: [
			[0, 5],
			[length, 5],
		],
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
	it("should label a named segment's panel with the segment's name, not the sequence's accession", () => {
		mockElementWidth(400);

		renderIsolate([
			sequence("seg:L", "NC_L", 8900),
			sequence("seg:M", "NC_M", 4800),
			sequence("seg:S", "NC_S", 2900),
		]);

		expect(screen.getAllByRole("img")).toHaveLength(1);
		expect(screen.getByText("L")).toBeVisible();
		expect(screen.getByText("M")).toBeVisible();
		expect(screen.getByText("S")).toBeVisible();
		expect(screen.queryByText("NC_L")).toBeNull();
		expect(screen.queryByText(/not in this isolate/)).toBeNull();
	});

	it("should fall back to the accession when the segment has no schema name", () => {
		mockElementWidth(400);

		render(
			<PathoscopeIsolate
				coverage={0.9}
				depth={12}
				maxDepth={20}
				name="Isolate A"
				pi={0.5}
				reads={30}
				segments={[segment("len:8900", 8900, null)]}
				sequences={[sequence("len:8900", "NC_X", 8900)]}
			/>,
		);

		expect(screen.getByText("NC_X")).toBeVisible();
	});

	it("should hold the panel open for a segment the isolate does not carry", () => {
		mockElementWidth(400);

		// No M sequence. The panel has to stay in place, or L and S would read as
		// though they were the isolate's first two segments.
		renderIsolate([
			sequence("seg:L", "NC_L", 8900),
			sequence("seg:S", "NC_S", 2900),
		]);

		expect(screen.getByText("M · not in this isolate")).toBeVisible();
	});

	it("should not claim the isolate lacks a segment nothing mapped to", () => {
		mockElementWidth(400);

		// Every isolate is empty on a segment no hit was recorded against, and the
		// reference may well describe it for all of them — so the label must not say
		// this isolate does not carry it.
		render(
			<PathoscopeIsolate
				coverage={0.9}
				depth={12}
				maxDepth={20}
				name="Isolate A"
				pi={0.5}
				reads={30}
				segments={[
					segment("seg:L", 8900, "L"),
					segment("seg:M", 4800, "M", false),
				]}
				sequences={[sequence("seg:L", "NC_L", 8900)]}
			/>,
		);

		expect(screen.getByText("M · no reads")).toBeVisible();
		expect(screen.queryByText("M · not in this isolate")).toBeNull();
	});

	it("should reveal a sequence's accession and definition in a popover when its label is clicked", async () => {
		mockElementWidth(400);

		renderIsolate([sequence("seg:L", "NC_L", 8900)]);

		await userEvent.click(screen.getByText("L"));

		expect(
			await screen.findAllByText("NC_L · NC_L definition"),
		).not.toHaveLength(0);
	});

	it("should render nothing but the heading for an isolate with no segments", () => {
		render(
			<PathoscopeIsolate
				coverage={0}
				depth={0}
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
