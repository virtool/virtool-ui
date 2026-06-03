import { useServerVersionStore } from "@app/serverVersion";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it, vi } from "vitest";
import UpdateBanner from "../UpdateBanner";

const MESSAGE = "A new version of Virtool is available.";

describe("<UpdateBanner />", () => {
	afterEach(() => {
		useServerVersionStore.setState({ version: null });
	});

	it("renders nothing before the server version is known", () => {
		renderWithProviders(<UpdateBanner />);
		expect(screen.queryByText(MESSAGE)).not.toBeInTheDocument();
	});

	it("renders nothing when the server version matches the running build", () => {
		useServerVersionStore.setState({ version: __APP_VERSION__ });
		renderWithProviders(<UpdateBanner />);
		expect(screen.queryByText(MESSAGE)).not.toBeInTheDocument();
	});

	it("prompts a reload when the server reports a different version", async () => {
		const reload = vi.fn();
		const original = window.location;
		Object.defineProperty(window, "location", {
			configurable: true,
			value: { ...original, reload },
		});

		useServerVersionStore.setState({ version: "9.9.9" });
		renderWithProviders(<UpdateBanner />);

		expect(screen.getByText(MESSAGE)).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Reload" }));
		expect(reload).toHaveBeenCalledOnce();

		Object.defineProperty(window, "location", {
			configurable: true,
			value: original,
		});
	});
});
