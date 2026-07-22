import { screen, within } from "@testing-library/react";
import { mockGetRoot } from "@tests/server-fn/root";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import AboutDialog from "../AboutDialog";

describe("<AboutDialog />", () => {
	it("shows the server and web app versions", async () => {
		mockGetRoot({ first_user: false, version: "5.4.3" });

		renderWithProviders(<AboutDialog open setOpen={() => undefined} />);

		const serverVersion = await screen.findByText("5.4.3");
		const server = screen.getByText("Server").closest("div");
		expect(server).toContainElement(serverVersion);

		const webApp = screen.getByText("Web app").closest("div");
		expect(
			within(webApp as HTMLElement).getByText(__APP_VERSION__),
		).toBeInTheDocument();
	});
});
