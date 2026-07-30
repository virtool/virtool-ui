import {
	type AnalysisSearch,
	AnalysisSearchProvider,
} from "@analyses/components/AnalysisSearchContext";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@tests/setup";
import { describe, expect, it, vi } from "vitest";
import { PathoscopeToolbar } from "../PathoscopeToolbar";

function renderToolbar(search: AnalysisSearch = {}) {
	const setSearch = vi.fn();

	renderWithProviders(
		<AnalysisSearchProvider search={search} setSearch={setSearch}>
			<PathoscopeToolbar analysisId={5} />
		</AnalysisSearchProvider>,
	);

	return setSearch;
}

describe("<PathoscopeToolbar />", () => {
	it("should show the charts selected by default and switch to the table", async () => {
		const setSearch = renderToolbar();

		expect(screen.getByRole("radio", { name: "Charts" })).toHaveAttribute(
			"data-state",
			"on",
		);
		expect(screen.getByRole("radio", { name: "Table" })).toHaveAttribute(
			"data-state",
			"off",
		);

		await userEvent.click(screen.getByRole("radio", { name: "Table" }));

		expect(setSearch).toHaveBeenCalledWith({ table: true });
	});

	it("should show the table selected and switch back to the charts", async () => {
		const setSearch = renderToolbar({ table: true });

		expect(screen.getByRole("radio", { name: "Table" })).toHaveAttribute(
			"data-state",
			"on",
		);

		await userEvent.click(screen.getByRole("radio", { name: "Charts" }));

		expect(setSearch).toHaveBeenCalledWith({ table: false });
	});

	// The trigger shows the sort key alone, so its name is the only thing left
	// saying the control sorts.
	it("should name the sort trigger for the key it sorts by", () => {
		renderToolbar({ sortKey: "depth" });

		expect(
			screen.getByRole("button", { name: "Sort by Depth" }),
		).toBeInTheDocument();
	});

	// The direction button is an arrow and nothing else, so without a name it
	// reaches assistive technology as an unlabelled button.
	it("should name the sort direction button for the direction it switches to", async () => {
		const setSearch = renderToolbar({ sortDirection: "desc" });

		await userEvent.click(
			screen.getByRole("button", { name: "Sort ascending" }),
		);

		expect(setSearch).toHaveBeenCalledWith({ sortDirection: "asc" });
	});

	// The isolate filter only narrows an expanded hit's detail, which the table
	// layout does not render.
	it("should drop the isolate filter in the table layout", () => {
		renderToolbar({ table: true });

		expect(
			screen.getByRole("button", { name: "Filter OTUs" }),
		).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Filter Isolates" }),
		).not.toBeInTheDocument();
	});
});
