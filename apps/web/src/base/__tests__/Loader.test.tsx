import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup.js";
import { describe, expect, it } from "vitest";
import Loader from "../Loader";

describe("<Loader />", () => {
	it("keeps a transparent bottom border so the spin is visible", () => {
		renderWithProviders(<Loader />);

		const loader = screen.getByRole("status", { name: "loading" });

		expect(loader).toHaveClass("border-b-transparent");
		expect(loader).toHaveClass("animate-rotate");
	});

	it("keeps the transparent bottom border across every color", () => {
		const colors = [
			["blue", "border-t-blue-600"],
			["green", "border-t-green-600"],
			["gray", "border-t-gray-500"],
			["orange", "border-t-orange-600"],
			["purple", "border-t-purple-600"],
			["red", "border-t-red-600"],
		] as const;

		for (const [color, expectedClass] of colors) {
			const { unmount } = renderWithProviders(<Loader color={color} />);

			const loader = screen.getByRole("status", { name: "loading" });

			expect(loader).toHaveClass("border-b-transparent");
			expect(loader).toHaveClass(expectedClass);

			unmount();
		}
	});
});
