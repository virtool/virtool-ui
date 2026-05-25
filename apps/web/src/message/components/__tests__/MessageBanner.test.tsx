import { screen } from "@testing-library/react";
import { createFakeMessage } from "@tests/fake/message";
import { renderWithProviders } from "@tests/setup";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useFetchMessage } from "../../queries";
import MessageBanner from "../MessageBanner";

vi.mock("../../queries", () => ({
	useFetchMessage: vi.fn(),
}));

const useFetchMessageMock = vi.mocked(useFetchMessage);

beforeEach(() => {
	useFetchMessageMock.mockReset();
});

describe("MessageBanner", () => {
	it("shows the message when it is active", () => {
		useFetchMessageMock.mockReturnValue({
			data: createFakeMessage({ active: true, message: "Maintenance tonight" }),
			isPending: false,
		} as ReturnType<typeof useFetchMessage>);

		renderWithProviders(<MessageBanner />);

		expect(screen.getByText("Maintenance tonight")).toBeInTheDocument();
	});

	it("applies the configured color class to the banner", () => {
		useFetchMessageMock.mockReturnValue({
			data: createFakeMessage({
				active: true,
				color: "blue",
				message: "Heads up",
			}),
			isPending: false,
		} as ReturnType<typeof useFetchMessage>);

		renderWithProviders(<MessageBanner />);

		expect(screen.getByText("Heads up")).toHaveClass("bg-blue-500");
	});

	it("hides the message when it is inactive", () => {
		useFetchMessageMock.mockReturnValue({
			data: createFakeMessage({
				active: false,
				message: "Maintenance tonight",
			}),
			isPending: false,
		} as ReturnType<typeof useFetchMessage>);

		renderWithProviders(<MessageBanner />);

		expect(screen.queryByText("Maintenance tonight")).not.toBeInTheDocument();
	});
});
