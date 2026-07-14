import AnalysisDetail from "@analyses/components/AnalysisDetail";
import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { boolOptional, strOptional } from "@app/searchParams";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute, notFound } from "@tanstack/react-router";

/** Search params for the analysis viewer. */
type AnalysisDetailSearch = {
	find?: string;
	sort?: string;
	sortDesc?: boolean;
	filterOtus?: boolean;
	filterIsolates?: boolean;
	reads?: boolean;
	filterSequences?: boolean;
	filterOrfs?: boolean;
	activeHit?: string;
};

function validateAnalysisDetailSearch(
	input: Partial<AnalysisDetailSearch> & SearchSchemaInput,
): AnalysisDetailSearch {
	return {
		find: strOptional(input.find),
		sort: strOptional(input.sort),
		sortDesc: boolOptional(input.sortDesc),
		filterOtus: boolOptional(input.filterOtus),
		filterIsolates: boolOptional(input.filterIsolates),
		reads: boolOptional(input.reads),
		filterSequences: boolOptional(input.filterSequences),
		filterOrfs: boolOptional(input.filterOrfs),
		activeHit: strOptional(input.activeHit),
	};
}

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/$analysisId",
)({
	validateSearch: validateAnalysisDetailSearch,
	loader: async ({ context: { queryClient }, params: { analysisId } }) => {
		const { analysisQueryOptions } = await import("@analyses/queries");

		try {
			await queryClient.ensureQueryData(analysisQueryOptions(analysisId));
		} catch (error) {
			if (
				error != null &&
				typeof error === "object" &&
				"response" in error &&
				(error as { response: { status: number } }).response.status === 404
			) {
				throw notFound();
			}
			throw error;
		}
	},
	component: AnalysisRoute,
});

function AnalysisRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<AnalysisSearchProvider
			search={search}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		>
			<AnalysisDetail />
		</AnalysisSearchProvider>
	);
}
