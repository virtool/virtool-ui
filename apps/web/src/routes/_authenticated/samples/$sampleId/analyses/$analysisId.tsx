import AnalysisDetail from "@analyses/components/AnalysisDetail";
import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { getErrorStatus } from "@app/queryErrors";
import {
	boolOptional,
	numInRangeOptional,
	oneOfOptional,
	strOptional,
} from "@app/searchParams";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute, notFound } from "@tanstack/react-router";

const SORT_DIRECTIONS = ["asc", "desc"] as const;

/** Search params for the analysis viewer. */
type AnalysisDetailSearch = {
	find?: string;
	sortKey?: string;
	sortDirection?: (typeof SORT_DIRECTIONS)[number];
	filterOtus?: boolean;
	filterIsolates?: boolean;
	minCoverage?: number;
	reads?: boolean;
	filterSequences?: boolean;
	filterOrfs?: boolean;
	activeHit?: string;
	table?: boolean;
};

function validateAnalysisDetailSearch(
	input: Partial<AnalysisDetailSearch> & SearchSchemaInput,
): AnalysisDetailSearch {
	return {
		find: strOptional(input.find),
		sortKey: strOptional(input.sortKey),
		sortDirection: oneOfOptional(input.sortDirection, SORT_DIRECTIONS),
		filterOtus: boolOptional(input.filterOtus),
		filterIsolates: boolOptional(input.filterIsolates),
		minCoverage: numInRangeOptional(input.minCoverage, 0, 1),
		reads: boolOptional(input.reads),
		filterSequences: boolOptional(input.filterSequences),
		filterOrfs: boolOptional(input.filterOrfs),
		activeHit: strOptional(input.activeHit),
		table: boolOptional(input.table),
	};
}

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/$analysisId",
)({
	validateSearch: validateAnalysisDetailSearch,
	loader: async ({ context: { queryClient }, params: { analysisId } }) => {
		const { analysisQueryOptions } = await import("@analyses/queries");

		try {
			await queryClient.ensureQueryData(
				analysisQueryOptions(Number(analysisId)),
			);
		} catch (error) {
			if (getErrorStatus(error) === 404) {
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
