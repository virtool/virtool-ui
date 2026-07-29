import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";
import PathoscopeSequence from "../PathoscopeSequence";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("<PathoscopeSequence />", () => {
	it("should render an accessible coverage chart with a data-informed label", () => {
		renderWithProviders(
			<PathoscopeSequence
				accession="NC_001498"
				data={[]}
				definition="Measles virus"
				length={1000}
				segmentLength={1000}
				width={400}
				yMax={12}
			/>,
		);

		const svg = screen.getByRole("img");

		expect(svg.getAttribute("aria-label")).toBe(
			"Read depth coverage across the NC_001498 sequence, 1000 nucleotides long.",
		);
		expect(svg.querySelector("title")?.textContent).toBe(
			svg.getAttribute("aria-label"),
		);
	});

	it("should scale the horizontal axis to the segment, not the sequence", () => {
		// A sequence covering half of the segment it fills must stop halfway across
		// the column rather than being stretched over it.
		renderWithProviders(
			<PathoscopeSequence
				accession="NC_001498"
				data={[
					[0, 12],
					[500, 12],
				]}
				definition="Measles virus"
				length={500}
				segmentLength={1000}
				width={400}
				yMax={12}
			/>,
		);

		const d =
			screen
				.getByRole("img")
				.querySelector("path.depth-area")
				?.getAttribute("d") ?? "";

		const xValues = [...d.matchAll(/[ML]([\d.]+),/g)].map((match) =>
			Number(match[1]),
		);

		expect(Math.max(...xValues)).toBe(200);
	});
});
