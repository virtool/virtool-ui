import NuvsViewer from "@analyses/components/Nuvs/NuvsViewer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	createFakeFormattedNuVsAnalysis,
	mockApiBlastNuVs,
} from "@tests/fake/analyses";
import { createFakeSample } from "@tests/fake/samples";
import nock from "nock";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { z } from "zod/v4";

const analysisSearchSchema = z.object({
	find: z.string().optional().catch(undefined),
	sort: z.string().optional().catch(undefined),
	sortDesc: z.boolean().optional().catch(undefined),
	filterOtus: z.boolean().optional().catch(undefined),
	filterIsolates: z.boolean().optional().catch(undefined),
	reads: z.boolean().optional().catch(undefined),
	filterSequences: z.boolean().optional().catch(undefined),
	filterOrfs: z.boolean().optional().catch(undefined),
	activeHit: z.string().optional().catch(undefined),
});

async function renderWithAnalysisRoute(ui: React.ReactElement) {
	const rootRoute = createRootRoute();
	const authenticatedRoute = createRoute({
		getParentRoute: () => rootRoute,
		id: "_authenticated",
	});
	const analysisRoute = createRoute({
		getParentRoute: () => authenticatedRoute,
		path: "samples/$sampleId/analyses/$analysisId",
		validateSearch: analysisSearchSchema,
		component: () => ui,
	});
	authenticatedRoute.addChildren([analysisRoute]);
	rootRoute.addChildren([authenticatedRoute]);

	const queryClient = new QueryClient();

	// @ts-expect-error createRouter requires strictNullChecks which is not enabled project-wide
	const router = createRouter({
		routeTree: rootRoute,
		history: createMemoryHistory({
			initialEntries: ["/samples/test-sample/analyses/test-analysis"],
		}),
		defaultPendingMinMs: 0,
	});

	await router.load();

	return render(
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
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
			await renderWithAnalysisRoute(<NuvsViewer {...props} />);

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
			await renderWithAnalysisRoute(<NuvsViewer {...props} />);

			await userEvent.click(
				await screen.findByRole("button", { name: "BLAST at NCBI" }),
			);
			scope.done();
		});
	});

	describe("<NuVsExport />", () => {
		it("should render export dialog when exporting", async () => {
			await renderWithAnalysisRoute(<NuvsViewer {...props} />);

			await userEvent.click(screen.getByRole("button", { name: "Export" }));
			expect(screen.getByText("Export Analysis")).toBeInTheDocument();
			expect(
				screen.getByRole("button", { name: "Download" }),
			).toBeInTheDocument();
		});
	});
});
