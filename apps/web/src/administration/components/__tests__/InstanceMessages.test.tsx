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

	it("renders all messages and marks the active one", async () => {
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
		expect(screen.getByText("Active")).toBeInTheDocument();

		const switches = screen.getAllByRole("switch");
		expect(switches[0]).toBeChecked();
		expect(switches[1]).not.toBeChecked();
	});

	it("activates an inactive message via setActiveMessage", async () => {
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
		await userEvent.click(
			screen.getByRole("switch", { name: "Activate message" }),
		);

		await waitFor(() =>
			expect(setActiveMessage).toHaveBeenCalledWith({ data: { id: 1 } }),
		);
	});

	it("deactivates the active message via clearActiveMessage", async () => {
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
		await userEvent.click(
			screen.getByRole("switch", { name: "Deactivate message" }),
		);

		await waitFor(() => expect(clearActiveMessage).toHaveBeenCalled());
	});
});
