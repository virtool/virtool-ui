import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import { CreateReference } from "../CreateReference";

describe("<CreateReference />", () => {
	it("should not render dialog content when closed", () => {
		renderWithProviders(
			<CreateReference open={false} onOpenChange={() => {}} />,
		);

		expect(screen.queryByText("Create Reference")).not.toBeInTheDocument();
	});

	it("should default to the Empty tab when opened", () => {
		renderWithProviders(
			<CreateReference open={true} onOpenChange={() => {}} />,
		);

		expect(screen.getByText("Create Reference")).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Empty" })).toHaveAttribute(
			"data-state",
			"active",
		);
	});

	it("should preserve input values when switching between tabs", async () => {
		renderWithProviders(
			<CreateReference open={true} onOpenChange={() => {}} />,
		);

		const emptyPanel = screen.getByRole("tabpanel", { name: "Empty" });
		await userEvent.type(
			within(emptyPanel).getByRole("textbox", { name: "Name" }),
			"Test Reference",
		);

		await userEvent.click(screen.getByRole("tab", { name: "Import" }));
		await userEvent.click(screen.getByRole("tab", { name: "Empty" }));

		expect(
			within(screen.getByRole("tabpanel", { name: "Empty" })).getByRole(
				"textbox",
				{ name: "Name" },
			),
		).toHaveValue("Test Reference");
	});
});
