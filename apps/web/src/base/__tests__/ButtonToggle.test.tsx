import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ButtonToggle from "../ButtonToggle";

describe("<ButtonToggle />", () => {
	it("should report its state through aria-pressed", () => {
		render(
			<ButtonToggle onPressedChange={vi.fn()} pressed>
				Filter OTUs
			</ButtonToggle>,
		);

		expect(screen.getByRole("button", { name: "Filter OTUs" })).toHaveAttribute(
			"aria-pressed",
			"true",
		);
	});

	// Styled off `aria-pressed` rather than Radix's `data-state`, so what is
	// announced and what is drawn cannot drift apart.
	it("should draw the on state from the same attribute it announces", () => {
		render(
			<ButtonToggle onPressedChange={vi.fn()} pressed>
				Filter OTUs
			</ButtonToggle>,
		);

		const button = screen.getByRole("button", { name: "Filter OTUs" });

		expect(button).toHaveClass("aria-pressed:bg-gray-700");
		expect(button).toHaveClass("aria-pressed:text-white");
	});

	it("should report a press to its owner", async () => {
		const onPressedChange = vi.fn();

		render(
			<ButtonToggle onPressedChange={onPressedChange} pressed={false}>
				Filter OTUs
			</ButtonToggle>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Filter OTUs" }));

		expect(onPressedChange).toHaveBeenCalledWith(true);
	});
});
