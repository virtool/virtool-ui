import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import { EditLabel } from "../EditLabel";

const baseProps = {
	color: "#1DAD57",
	description: "This is a description",
	name: "Foo",
};

describe("<EditLabel>", () => {
	it("initializes the form from props and submits the edited values", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);
		renderWithProviders(<EditLabel {...baseProps} onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "edit label" }));

		const descriptionInput = screen.getByLabelText("Description");
		const nameInput = screen.getByLabelText("Name");

		expect(nameInput).toHaveValue("Foo");
		expect(descriptionInput).toHaveValue("This is a description");

		await userEvent.clear(descriptionInput);
		await userEvent.clear(nameInput);
		await userEvent.type(descriptionInput, "This is a label");
		await userEvent.type(nameInput, "Bar");

		await userEvent.click(screen.getByText("Save"));

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				color: "#1DAD57",
				description: "This is a label",
				name: "Bar",
			}),
		);
	});
});
