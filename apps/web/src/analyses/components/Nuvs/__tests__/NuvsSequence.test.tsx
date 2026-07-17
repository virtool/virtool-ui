import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";
import NuvsSequence from "../NuvsSequence";

/**
 * jsdom does not lay out elements, so `offsetWidth` is always zero. The ruler
 * measures its container to size the axis, so stub a realistic width.
 */
function mockElementWidth(width: number) {
	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("<NuvsSequence />", () => {
	it("should render an accessible ruler with a data-informed label", () => {
		mockElementWidth(400);

		renderWithProviders(
			<NuvsSequence maxSequenceLength={20} sequence="ATCGATCG" />,
		);

		const svg = screen.getByRole("img");

		expect(svg.getAttribute("aria-label")).toBe(
			"Sequence ruler: a 8 nucleotide sequence on a scale up to 20 nucleotides.",
		);
		expect(svg.querySelector("title")?.textContent).toBe(
			svg.getAttribute("aria-label"),
		);
	});
});
