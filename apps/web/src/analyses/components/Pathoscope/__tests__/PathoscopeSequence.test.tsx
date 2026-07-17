import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";
import PathoscopeSequence from "../PathoscopeSequence";

/**
 * jsdom does not lay out elements, so `offsetWidth` is always zero. The chart
 * measures its container to size the plot, so stub a realistic width.
 */
function mockElementWidth(width: number) {
	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("<PathoscopeSequence />", () => {
	it("should render an accessible coverage chart with a data-informed label", () => {
		mockElementWidth(400);

		renderWithProviders(
			<PathoscopeSequence
				accession="NC_001498"
				data={[]}
				definition="Measles virus"
				id="foo"
				length={1000}
				maxGenomeLength={1000}
				ratio={1}
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
});
