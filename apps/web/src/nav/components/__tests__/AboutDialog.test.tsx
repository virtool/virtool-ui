import { screen, within } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import AboutDialog from "../AboutDialog";

describe("<AboutDialog />", () => {
	it("shows the server and web app versions", () => {
		renderWithProviders(<AboutDialog open setOpen={() => undefined} />);

		expect(screen.getByText("Server")).toBeInTheDocument();

		const webApp = screen.getByText("Web app").closest("div");
		expect(
			within(webApp as HTMLElement).getByText(__APP_VERSION__),
		).toBeInTheDocument();
	});
});
