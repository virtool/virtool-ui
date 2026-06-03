import { useServerVersionStore } from "@app/serverVersion";
import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { afterEach, describe, expect, it } from "vitest";
import AboutDialog from "../AboutDialog";

describe("<AboutDialog />", () => {
	afterEach(() => {
		useServerVersionStore.setState({ version: null });
	});

	it("shows the server, web service, and web app versions", () => {
		useServerVersionStore.setState({ version: "9.9.9" });
		renderWithProviders(<AboutDialog open setOpen={() => undefined} />);

		const webService = screen.getByText("Web service").closest("div");
		expect(
			within(webService as HTMLElement).getByText("9.9.9"),
		).toBeInTheDocument();

		const webApp = screen.getByText("Web app").closest("div");
		expect(
			within(webApp as HTMLElement).getByText(__APP_VERSION__),
		).toBeInTheDocument();

		expect(screen.getByText("Server")).toBeInTheDocument();
	});

	it("shows a placeholder for the web service before its version is known", () => {
		renderWithProviders(<AboutDialog open setOpen={() => undefined} />);

		const webService = screen.getByText("Web service").closest("div");
		expect(
			within(webService as HTMLElement).getByText("—"),
		).toBeInTheDocument();
	});
});
