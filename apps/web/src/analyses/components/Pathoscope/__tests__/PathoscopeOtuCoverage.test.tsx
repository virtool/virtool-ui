import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import type { Coordinate, PathoscopeSegmentCoverage } from "@virtool/contracts";
import { afterEach, describe, expect, it, vi } from "vitest";
import PathoscopeOtuCoverage from "../PathoscopeOtuCoverage";

/**
 * jsdom does not lay out elements, so `offsetWidth` is always zero. The chart
 * measures its container to size the area, so stub a realistic width.
 */
function mockElementWidth(width: number) {
	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
}

function segment(
	align: Coordinate[],
	length: number,
	name: string | null = null,
): PathoscopeSegmentCoverage {
	return {
		align,
		detected: align.length > 0,
		key: name === null ? `len:${length}` : `seg:${name}`,
		length,
		name,
	};
}

const align: Coordinate[] = [
	[0, 0],
	[1, 5],
	[2, 12],
	[3, 3],
	[4, 0],
];

const single = [segment(align, 5)];

function paths(): SVGPathElement[] {
	return [...screen.getByRole("img").querySelectorAll("path")];
}

function xValuesOf(path: SVGPathElement | undefined): number[] {
	const d = path?.getAttribute("d") ?? "";

	return [...d.matchAll(/[ML]([\d.]+),/g)].map((match) => Number(match[1]));
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("<PathoscopeOtuCoverage />", () => {
	it("should render an area path for the coverage polyline", () => {
		mockElementWidth(400);

		renderWithProviders(
			<PathoscopeOtuCoverage maxDepth={12} segments={single} />,
		);

		const [path] = paths();

		expect(path).not.toBeUndefined();
		expect(path?.getAttribute("d")).toMatch(/^M0,80L/);
	});

	it("should render no path when the container has not been measured", () => {
		mockElementWidth(0);

		renderWithProviders(
			<PathoscopeOtuCoverage maxDepth={12} segments={single} />,
		);

		expect(paths()).toHaveLength(0);
	});

	it("should render no path when the OTU recorded no coverage", () => {
		mockElementWidth(400);

		renderWithProviders(<PathoscopeOtuCoverage maxDepth={0} segments={[]} />);

		expect(paths()).toHaveLength(0);
	});

	it("should draw no more points than the container has pixels", () => {
		mockElementWidth(50);

		// A dense curve, with a peak in the middle of the column the 50px container
		// leaves for it.
		const dense: Coordinate[] = Array.from({ length: 5000 }, (_, index) => [
			index,
			index === 2510 ? 900 : index % 7,
		]);

		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={900}
				segments={[segment(dense, 5000)]}
			/>,
		);

		const d = paths()[0]?.getAttribute("d") ?? "";

		// The area path repeats each point on the way back along the baseline.
		const points = [...d.matchAll(/[ML]([\d.]+),/g)].length / 2;

		expect(points).toBeLessThanOrEqual(50);

		// The peak is what the column reports, so it still reaches the top of the
		// chart.
		expect(d).toContain(",0L");
	});

	it("should scale the polyline across the full segment length", () => {
		mockElementWidth(400);

		// The polyline stops well short of the genome it spans, which is what a
		// simplified curve does. The chart must scale to the segment rather than to
		// the last point it was given.
		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={8}
				segments={[
					segment(
						[
							[0, 0],
							[100, 8],
						],
						200,
					),
				]}
			/>,
		);

		// 100 of 200 positions is half the 400px container.
		expect(Math.max(...xValuesOf(paths()[0]))).toBe(200);
	});

	it("should draw one path per segment, each in a panel of its own width", () => {
		mockElementWidth(406);

		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={12}
				segments={[
					segment(
						[
							[0, 0],
							[300, 12],
						],
						300,
						"L",
					),
					segment(
						[
							[0, 0],
							[100, 12],
						],
						100,
						"S",
					),
				]}
			/>,
		);

		const [first, second] = paths();

		// 300 and 100 nucleotides of 400, across 400px once the 6px gap between the
		// panels is taken out. Each panel is drawn in an svg of its own, so a curve
		// starts at its panel's left edge rather than at an offset into a shared one.
		expect(Math.max(...xValuesOf(first))).toBe(300);
		expect(first?.closest("svg")?.getAttribute("width")).toBe("300");

		expect(Math.max(...xValuesOf(second))).toBe(100);
		expect(second?.closest("svg")?.getAttribute("width")).toBe("100");
	});

	it("should draw every segment against the deepest point in the OTU", () => {
		mockElementWidth(400);

		// The second segment peaks at a fifth of the first's depth, so it must be
		// drawn a fifth as tall rather than filling its own panel.
		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={100}
				segments={[segment([[0, 100]], 10, "L"), segment([[0, 20]], 10, "S")]}
			/>,
		);

		const heightOf = (path: SVGPathElement | undefined) =>
			Number(
				/^M[\d.]+,([\d.]+)/.exec(path?.getAttribute("d") ?? "")?.[1] ?? "",
			);

		expect(heightOf(paths()[0])).toBe(0);
		expect(heightOf(paths()[1])).toBe(64);
	});

	it("should label each segment when the OTU has more than one", () => {
		mockElementWidth(400);

		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={12}
				segments={[segment(align, 3400, "L"), segment(align, 800)]}
			/>,
		);

		// A named segment carries its name; one matched by length says so
		// approximately, because the sequences filling it differ.
		expect(screen.getByText("L")).toBeVisible();
		expect(screen.getByText("≈800 nt")).toBeVisible();
	});

	it("should say why a segment nothing mapped to is blank", () => {
		mockElementWidth(400);

		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={12}
				segments={[
					segment(align, 3400, "L"),
					{ align: [], detected: false, key: "seg:M", length: 1200, name: "M" },
				]}
			/>,
		);

		// The panel keeps its place in the layout but draws nothing, so the label has
		// to carry the reason — a blank panel alone reads as a gap.
		expect(paths()).toHaveLength(1);
		expect(screen.getByText("M · no reads")).toBeVisible();
	});

	it("should not label the single segment of an unsegmented otu", () => {
		mockElementWidth(400);

		renderWithProviders(
			<PathoscopeOtuCoverage maxDepth={12} segments={[segment(align, 5000)]} />,
		);

		expect(screen.queryByText("≈5.0 kb")).toBeNull();
	});

	it("should reserve the label row's height even when it has nothing to say", () => {
		mockElementWidth(400);

		// The unsegmented case draws no label text, but the box must still be the
		// same height as one that does — otherwise it sits flush against the
		// bottom of its box while a labelled one grows to fit its caption.
		const { container } = renderWithProviders(
			<PathoscopeOtuCoverage maxDepth={12} segments={[segment(align, 5000)]} />,
		);

		const labelRow = container.querySelector(".text-gray-600.text-xs");

		expect(labelRow).not.toBeNull();
		expect((labelRow as HTMLElement).style.height).toBe("18px");
		expect(labelRow?.textContent).toBe("");
	});

	it("should left-justify segment labels", () => {
		mockElementWidth(400);

		renderWithProviders(
			<PathoscopeOtuCoverage
				maxDepth={12}
				segments={[segment(align, 3400, "L"), segment(align, 800)]}
			/>,
		);

		expect(screen.getByText("L").className).toContain("text-left");
	});
});
