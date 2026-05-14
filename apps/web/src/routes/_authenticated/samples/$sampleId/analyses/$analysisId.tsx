import AnalysisDetail from "@analyses/components/AnalysisDetail";
import { AnalysisSearchProvider } from "@analyses/components/AnalysisSearchContext";
import { analysisQueryOptions } from "@analyses/queries";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod/v4";

const analysisDetailSearchSchema = z.object({
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

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/$analysisId",
)({
	validateSearch: analysisDetailSearchSchema,
	loader: async ({ context: { queryClient }, params: { analysisId } }) => {
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
