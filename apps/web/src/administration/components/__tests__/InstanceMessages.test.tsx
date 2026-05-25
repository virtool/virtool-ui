import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createFakeMessage } from "@tests/fake/message";
import { renderWithProviders } from "@tests/setup";
import { beforeEach, describe, expect, it, vi } from "vitest";

const findMessages = vi.fn();
const setActiveMessage = vi.fn();
const clearActiveMessage = vi.fn();
const createMessage = vi.fn();
const updateMessage = vi.fn();
const deleteMessage = vi.fn();

vi.mock("@server/messages/functions", () => ({
	findMessage: vi.fn(),
	findMessages: (...args: unknown[]) => findMessages(...args),
	setActiveMessage: (...args: unknown[]) => setActiveMessage(...args),
	clearActiveMessage: (...args: unknown[]) => clearActiveMessage(...args),
	createMessage: (...args: unknown[]) => createMessage(...args),
	updateMessage: (...args: unknown[]) => updateMessage(...args),
	deleteMessage: (...args: unknown[]) => deleteMessage(...args),
}));

const { default: InstanceMessages } = await import("../InstanceMessages");

beforeEach(() => {
	findMessages.mockReset();
	setActiveMessage.mockReset();
	clearActiveMessage.mockReset();
	createMessage.mockReset();
	updateMessage.mockReset();
	deleteMessage.mockReset();
});

describe("<InstanceMessages>", () => {
	it("renders the empty state when there are no messages", async () => {
		findMessages.mockResolvedValueOnce([]);
		renderWithProviders(<InstanceMessages />);

		expect(
			await screen.findByText(/no instance messages found/i),
		).toBeInTheDocument();
	});

	it("renders all messages with the active one selected", async () => {
		const messages = [
			createFakeMessage({
				id: 1,
				active: true,
				color: "blue",
				message: "Active one",
			}),
			createFakeMessage({
				id: 2,
				active: false,
				color: "red",
				message: "Inactive one",
			}),
		];
		findMessages.mockResolvedValueOnce(messages);

		renderWithProviders(<InstanceMessages />);

		expect(await screen.findByText("Active one")).toBeInTheDocument();
		expect(screen.getByText("Inactive one")).toBeInTheDocument();

		const radios = screen.getAllByRole("radio");
		// Off, message 1, message 2
		expect(radios).toHaveLength(3);
		expect(radios[0]).not.toBeChecked();
		expect(radios[1]).toBeChecked();
		expect(radios[2]).not.toBeChecked();
	});

	it("selects the Off option when no message is active", async () => {
		const messages = [
			createFakeMessage({
				id: 1,
				active: false,
				color: "blue",
				message: "First",
			}),
		];
		findMessages.mockResolvedValueOnce(messages);

		renderWithProviders(<InstanceMessages />);

		await screen.findByText("First");

		const radios = screen.getAllByRole("radio");
		expect(radios[0]).toBeChecked();
		expect(radios[1]).not.toBeChecked();
	});

	it("activates a message by selecting its radio", async () => {
		const messages = [
			createFakeMessage({
				id: 1,
				active: false,
				color: "blue",
				message: "First",
			}),
		];
		findMessages.mockResolvedValueOnce(messages);
		setActiveMessage.mockResolvedValueOnce(undefined);
		findMessages.mockResolvedValue(messages);

		renderWithProviders(<InstanceMessages />);

		await screen.findByText("First");
		await userEvent.click(screen.getByLabelText(/First/));

		await waitFor(() =>
			expect(setActiveMessage).toHaveBeenCalledWith({ data: { id: 1 } }),
		);
	});

	it("deactivates the active message by selecting Off", async () => {
		const messages = [
			createFakeMessage({
				id: 1,
				active: true,
				color: "blue",
				message: "First",
			}),
		];
		findMessages.mockResolvedValueOnce(messages);
		clearActiveMessage.mockResolvedValueOnce(null);
		findMessages.mockResolvedValue(messages);

		renderWithProviders(<InstanceMessages />);

		await screen.findByText("First");
		await userEvent.click(screen.getByLabelText(/Off/));

		await waitFor(() => expect(clearActiveMessage).toHaveBeenCalled());
	});
});
