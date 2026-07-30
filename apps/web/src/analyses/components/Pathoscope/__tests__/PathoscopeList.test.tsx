import {
	type AnalysisSearch,
	AnalysisSearchProvider,
} from "@analyses/components/AnalysisSearchContext";
import type { FormattedPathoscopeAnalysis } from "@analyses/types";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoViolations } from "@tests/axe";
import { createFakeAnalysisMinimal } from "@tests/fake/analyses";
import { createFakeSample } from "@tests/fake/samples";
import { renderWithProviders } from "@tests/setup";
import type { PathoscopeHit } from "@virtool/contracts";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PathoscopeList } from "../PathoscopeList";

function createHit(overrides: Partial<PathoscopeHit>): PathoscopeHit {
	return {
		abbreviation: "TMV",
		coverage: 0.5,
		depth: 12,
		id: "hit",
		isolates: [],
		length: 6000,
		maxDepth: 20,
		name: "Tobacco mosaic virus",
		pi: 0.25,
		segments: [],
		version: 3,
		...overrides,
	};
}

const hits = [
	createHit({ id: "a", name: "Alpha virus" }),
	createHit({ coverage: 0.25, depth: 7, id: "b", name: "Beta virus" }),
];

const analysis: FormattedPathoscopeAnalysis = {
	...createFakeAnalysisMinimal({ workflow: "pathoscope" }),
	files: [],
	results: { hits, readCount: 1000, subtractedCount: 0 },
	workflow: "pathoscope",
};

// The sample only supplies the read length the OTU filter divides by, and the
// filter is off in these tests.
const sample = createFakeSample();

const writeText = vi.fn().mockResolvedValue(undefined);

// Wrapped in a landmark the way the app shell wraps it, so each hit's
// ``<header>`` is scoped out of the banner role as it is in a real page.
// Ascending is set explicitly so the display order differs from click order
// below, regardless of which direction the app defaults to.
function renderList(search: AnalysisSearch = {}) {
	return renderWithProviders(
		<main>
			<AnalysisSearchProvider
				search={{
					filterOtus: false,
					sortKey: "coverage",
					sortDirection: "asc",
					...search,
				}}
				setSearch={vi.fn()}
			>
				<PathoscopeList analysis={analysis} sample={sample} />
			</AnalysisSearchProvider>
		</main>,
	);
}

beforeEach(() => {
	writeText.mockClear();

	vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
	vi.stubGlobal("isSecureContext", true);
});

describe("<PathoscopeList />", () => {
	it("should show the hit count until a hit is selected", async () => {
		renderList();

		expect(screen.getByText("2 hits")).toBeInTheDocument();
		expect(
			screen.queryByRole("button", { name: "Copy" }),
		).not.toBeInTheDocument();

		await userEvent.click(
			screen.getByRole("checkbox", { name: "Select Alpha virus" }),
		);

		expect(screen.getByText("1 selected")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
	});

	it("should copy the selected hits as a tab-separated table", async () => {
		renderList();

		await userEvent.click(
			screen.getByRole("checkbox", { name: "Select Beta virus" }),
		);
		await userEvent.click(screen.getByRole("button", { name: "Copy" }));

		expect(writeText).toHaveBeenCalledWith(
			["Name\tWeight\tDepth\tCoverage", "Beta virus\t0.250\t7\t0.250"].join(
				"\n",
			),
		);

		expect(
			await screen.findByRole("button", { name: "Copied" }),
		).toBeInTheDocument();
	});

	// The list is sorted ascending by coverage here, so Beta is shown above
	// Alpha even though Alpha is checked first.
	it("should copy the hits in display order rather than click order", async () => {
		renderList();

		await userEvent.click(
			screen.getByRole("checkbox", { name: "Select Alpha virus" }),
		);
		await userEvent.click(
			screen.getByRole("checkbox", { name: "Select Beta virus" }),
		);

		expect(screen.getByText("2 selected")).toBeInTheDocument();

		await userEvent.click(screen.getByRole("button", { name: "Copy" }));

		expect(writeText).toHaveBeenCalledWith(
			[
				"Name\tWeight\tDepth\tCoverage",
				"Beta virus\t0.250\t7\t0.250",
				"Alpha virus\t0.250\t12\t0.500",
			].join("\n"),
		);
	});

	// The checkbox sits beside the accordion trigger rather than inside it; a
	// checkbox nested in the trigger button would trip `nested-interactive`.
	it("should have no accessibility violations", async () => {
		const { container } = renderList();

		await expectNoViolations(container);
	});

	it("should select every hit from the header checkbox", async () => {
		renderList();

		await userEvent.click(
			screen.getByRole("checkbox", { name: "Select all hits" }),
		);

		expect(screen.getByText("2 selected")).toBeInTheDocument();
		expect(
			screen.getByRole("checkbox", { name: "Select Alpha virus" }),
		).toBeChecked();
		expect(
			screen.getByRole("checkbox", { name: "Select Beta virus" }),
		).toBeChecked();
	});

	describe("in table mode", () => {
		it("should show one row per hit, with no expandable detail", () => {
			renderList({ table: true });

			expect(
				screen.getByRole("columnheader", { name: "Coverage" }),
			).toBeInTheDocument();

			// The header row plus one row per hit.
			expect(screen.getAllByRole("row")).toHaveLength(3);

			const [beta, alpha] = screen.getAllByRole("row").slice(1);

			expect(beta).toHaveTextContent("Beta virus");
			expect(beta).toHaveTextContent("0.250");
			expect(beta).toHaveTextContent("7");

			expect(alpha).toHaveTextContent("Alpha virus");
			expect(alpha).toHaveTextContent("12");
			expect(alpha).toHaveTextContent("0.500");

			expect(
				screen.queryByRole("button", { name: /Alpha virus/ }),
			).not.toBeInTheDocument();
		});

		it("should label the weight column reads when read counts are shown", () => {
			renderList({ reads: true, table: true });

			expect(
				screen.getByRole("columnheader", { name: "Reads" }),
			).toBeInTheDocument();
			expect(
				screen.queryByRole("columnheader", { name: "Weight" }),
			).not.toBeInTheDocument();
		});

		it("should copy the hits selected from its rows", async () => {
			renderList({ table: true });

			await userEvent.click(
				screen.getByRole("checkbox", { name: "Select Beta virus" }),
			);
			await userEvent.click(screen.getByRole("button", { name: "Copy" }));

			expect(writeText).toHaveBeenCalledWith(
				["Name\tWeight\tDepth\tCoverage", "Beta virus\t0.250\t7\t0.250"].join(
					"\n",
				),
			);
		});

		it("should have no accessibility violations", async () => {
			const { container } = renderList({ table: true });

			await expectNoViolations(container);
		});
	});
});
