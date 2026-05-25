import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import CreateBanner from "../CreateBanner";

describe("<CreateBanner>", () => {
	it("submits with the message text and the selected color", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);
		renderWithProviders(<CreateBanner onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		await userEvent.type(screen.getByLabelText("Message"), "Hello world");
		await userEvent.click(screen.getByRole("radio", { name: "Blue" }));
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				message: "Hello world",
				color: "blue",
			}),
		);
	});

	it("defaults the color to red when none is picked", async () => {
		const onSubmit = vi.fn().mockResolvedValue(undefined);
		renderWithProviders(<CreateBanner onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));
		await userEvent.type(screen.getByLabelText("Message"), "Hello");
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() =>
			expect(onSubmit).toHaveBeenCalledWith({
				message: "Hello",
				color: "red",
			}),
		);
	});

	it("blocks submit when message is empty", async () => {
		const onSubmit = vi.fn();
		renderWithProviders(<CreateBanner onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));

		expect(screen.queryByText("Message is required.")).not.toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		expect(screen.getByText("Message is required.")).toBeInTheDocument();
		expect(onSubmit).not.toHaveBeenCalled();
	});

	it("shows the rejection message and keeps the dialog open on failure", async () => {
		const onSubmit = vi.fn().mockRejectedValue(new Error("Server exploded."));
		renderWithProviders(<CreateBanner onSubmit={onSubmit} />);

		await userEvent.click(screen.getByRole("button", { name: "Create" }));
		await userEvent.type(screen.getByLabelText("Message"), "Hi");
		await userEvent.click(screen.getByRole("button", { name: "Save" }));

		await waitFor(() =>
			expect(screen.getByText("Server exploded.")).toBeInTheDocument(),
		);
		expect(screen.getByLabelText("Message")).toBeInTheDocument();
	});
});
