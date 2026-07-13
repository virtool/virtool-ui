import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";
import PathoscopeOtuCoverage from "../PathoscopeOtuCoverage";

/**
 * jsdom does not lay out elements, so `offsetWidth` is always zero. The chart
 * measures its container to size the area, so stub a realistic width.
 */
function mockElementWidth(width: number) {
	vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockReturnValue(width);
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("<PathoscopeOtuCoverage />", () => {
	it("should render an area path for the coverage depths", () => {
		mockElementWidth(400);

		renderWithProviders(<PathoscopeOtuCoverage filled={[0, 5, 12, 3, 0]} />);

		const path = screen.getByRole("img").querySelector("path");

		expect(path).not.toBeNull();
		expect(path?.getAttribute("d")).toMatch(/^M0,60L/);
	});

	it("should render no path when the container has not been measured", () => {
		mockElementWidth(0);

		renderWithProviders(<PathoscopeOtuCoverage filled={[0, 5, 12, 3, 0]} />);

		expect(screen.getByRole("img").querySelector("path")).toBeNull();
	});

	it("should downsample a genome-length depth array to the container width", () => {
		mockElementWidth(400);

		const filled = Array.from({ length: 30000 }, (_, index) => index % 50);

		renderWithProviders(<PathoscopeOtuCoverage filled={filled} />);

		const d =
			screen.getByRole("img").querySelector("path")?.getAttribute("d") ?? "";

		const xValues = [...d.matchAll(/[ML]([\d.]+),/g)].map((match) =>
			Number(match[1]),
		);

		// The 30,000 depths collapse to one x per pixel column, not one per position.
		expect(new Set(xValues).size).toBe(400);
	});
});
