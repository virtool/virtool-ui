import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import EditBanner from "../EditBanner";

const baseProps = {
	color: "blue" as const,
	message: "Existing message",
};

describe("<EditBanner>", () => {
	it("initializes the form from props and submits the edited values", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);
		renderWithProviders(<EditBanner {...baseProps} onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "Edit" }));

		const messageInput = screen.getByLabelText("Message");
		expect(messageInput).toHaveValue("Existing message");
		expect(screen.getByRole("radio", { name: "Blue" })).toBeChecked();

		await userEvent.clear(messageInput);
		await userEvent.type(messageInput, "Updated message");
		await userEvent.click(screen.getByRole("radio", { name: "Purple" }));
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				message: "Updated message",
				color: "purple",
			}),
		);
	});

	it("blocks submit when the message is cleared", async () => {
		const onSubmit = vi.fn();
		renderWithProviders(<EditBanner {...baseProps} onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "Edit" }));
		await userEvent.clear(screen.getByLabelText("Message"));
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(screen.getByText("Message is required.")).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});
});
