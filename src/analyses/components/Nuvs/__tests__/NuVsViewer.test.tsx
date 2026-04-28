import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import NuvsViewer from "@analyses/components/Nuvs/NuvsViewer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	createFakeFormattedNuVsAnalysis,
	mockApiBlastNuVs,
} from "@tests/fake/analyses";
import { createFakeSample } from "@tests/fake/samples";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function renderWithAnalysisSearch(
	ui: React.ReactElement,
	search: { activeHit?: string } = {},
) {
	const queryClient = new QueryClient();

	return render(
		<QueryClientProvider client={queryClient}>
			<AnalysisSearchProvider search={search} setSearch={vi.fn()}>
				{ui}
			</AnalysisSearchProvider>
		</QueryClientProvider>,
	);
}

describe("<NuvsViewer />", () => {
	let props;
	let sample;
	let nuvs;

	beforeEach(() => {
		sample = createFakeSample();
		nuvs = createFakeFormattedNuVsAnalysis();
		props = {
			detail: nuvs,
			sample: sample,
		};
	});

	afterEach(() => nock.cleanAll());

	describe("<NuVsDetail />", () => {
		it("should render correctly", async () => {
			renderWithAnalysisSearch(<NuvsViewer {...props} />, {
				activeHit: String(nuvs.results.hits[0].id),
			});

			expect(
				await screen.findByText(
					"This sequence has no BLAST information attached to it.",
				),
			).toBeInTheDocument();
			expect(screen.getByText("Families")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "BLAST at NCBI" }),
			).toBeInTheDocument();
		});

		it("should render blast when clicked", async () => {
			const scope = mockApiBlastNuVs(nuvs.id, nuvs.results.hits[0].index);
			renderWithAnalysisSearch(<NuvsViewer {...props} />, {
				activeHit: String(nuvs.results.hits[0].id),
			});

			await userEvent.click(
				await screen.findByRole("button", { name: "BLAST at NCBI" }),
			);
			scope.done();
		});
	});

	describe("<NuVsExport />", () => {
		it("should render export dialog when exporting", async () => {
			renderWithAnalysisSearch(<NuvsViewer {...props} />, {
				activeHit: String(nuvs.results.hits[0].id),
			});

			await userEvent.click(screen.getByRole("button", { name: "Export" }));
			expect(screen.getByText("Export Analysis")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Download" }),
			).toBeInTheDocument();
		});
	});
});
