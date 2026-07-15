import { screen } from "@testing-library/react";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it } from "vitest";
import { IndexItemIcon } from "../IndexItemIcon";

describe("<IndexItemIcon />", () => {
	it("renders the active status for the current ready index", () => {
		renderWithProviders(<IndexItemIcon activeId="foo" id="foo" ready />);

		expect(screen.getByText("Active")).toBeInTheDocument();
	});

	it("hides the status for ready indexes that are not active", () => {
		const { container } = renderWithProviders(
			<IndexItemIcon activeId="foo" id="bar" ready />,
		);

		expect(container).toBeEmptyDOMElement();
	});

	it("renders the building status for a not-ready index", () => {
		renderWithProviders(<IndexItemIcon id="foo" ready={false} />);

		expect(screen.getByText("Building")).toBeInTheDocument();
		expect(screen.getByRole("status", { name: "loading" })).toBeInTheDocument();
		expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
	});
});
