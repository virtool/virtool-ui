import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import DeleteDialog from "../DeleteDialog";

describe("<DeleteDialog />", () => {
	it("titles the dialog and prompts with the item name", () => {
		renderWithProviders(
			<DeleteDialog name="Foo" noun="Sample" onConfirm={vi.fn()} open />,
		);

		expect(screen.getByText("Delete Sample")).toBeInTheDocument();
		expect(
			screen.getByText(/are you sure you want to delete/i),
		).toBeInTheDocument();
		expect(screen.getByText("Foo")).toBeInTheDocument();
	});

	it("opens from its trigger", async () => {
		renderWithProviders(
			<DeleteDialog
				name="Foo"
				noun="Sample"
				onConfirm={vi.fn()}
				trigger={<button type="button">open</button>}
			/>,
		);

		expect(screen.queryByText("Delete Sample")).toBeNull();

		await userEvent.click(screen.getByRole("button", { name: "open" }));

		expect(screen.getByText("Delete Sample")).toBeInTheDocument();
	});

	it("runs onConfirm and closes on success", async () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const onOpenChange = vi.fn();
		renderWithProviders(
			<DeleteDialog
				name="Foo"
				noun="Sample"
				onConfirm={onConfirm}
				onOpenChange={onOpenChange}
				open
			/>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

		await waitFor(() => expect(onConfirm).toHaveBeenCalledOnce());
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("renders the error and stays open when onConfirm rejects", async () => {
		const onConfirm = vi.fn().mockRejectedValue({
			response: { body: { message: "Cannot delete this." } },
		});
		renderWithProviders(
			<DeleteDialog name="Foo" noun="Sample" onConfirm={onConfirm} open />,
		);

		await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

		expect(await screen.findByRole("alert")).toHaveTextContent(
			"Cannot delete this.",
		);
		expect(screen.getByText("Delete Sample")).toBeInTheDocument();
	});

	it("closes without confirming when cancelled", async () => {
		const onConfirm = vi.fn();
		const onOpenChange = vi.fn();
		renderWithProviders(
			<DeleteDialog
				name="Foo"
				noun="Sample"
				onConfirm={onConfirm}
				onOpenChange={onOpenChange}
				open
			/>,
		);

		await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

		expect(onConfirm).not.toHaveBeenCalled();
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
