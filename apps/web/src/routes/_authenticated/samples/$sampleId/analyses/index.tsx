import AnalysesList from "@analyses/components/AnalysisList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const analysesListSearchSchema = z.object({
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/",
)({
	validateSearch: analysesListSearchSchema,
	component: AnalysesRoute,
});

function AnalysesRoute() {
	const { sampleId } = Route.useParams();
	const { page } = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<AnalysesList
			onPageChange={(page) => navigate({ search: { page } })}
			page={page}
			sampleId={sampleId}
		/>
	);
}
