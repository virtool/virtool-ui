import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";
import NuvsOrf from "../NuvsOrf";

/**
 * jsdom does not lay out elements, so `offsetWidth` is always zero. The glyph
 * measures its container to scale the arrow, so stub a realistic width.
 */
function mockElementWidth(width: number) {
	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("<NuvsOrf />", () => {
	it("should render an accessible glyph describing the reading frame", () => {
		mockElementWidth(400);

		renderWithProviders(
			<NuvsOrf
				hits={[]}
				maxSequenceLength={1000}
				pos={[340, 920]}
				strand={-1}
			/>,
		);

		const svg = screen.getByRole("img");

		expect(svg.getAttribute("aria-label")).toBe(
			"Open reading frame from position 340 to 920 on the reverse strand.",
		);
		expect(svg.querySelector("title")?.textContent).toBe(
			svg.getAttribute("aria-label"),
		);
	});
});
