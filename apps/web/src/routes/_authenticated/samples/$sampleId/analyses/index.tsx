import AnalysesList from "@analyses/components/AnalysisList";
import { type Paginated, paginated } from "@app/pagination";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

function validateAnalysesListSearch(
	input: Partial<Paginated> & SearchSchemaInput,
): Paginated {
	return paginated(input);
}

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/",
)({
	validateSearch: validateAnalysesListSearch,
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
