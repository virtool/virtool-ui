import AnalysesList from "@analyses/components/AnalysisList";
import { num } from "@app/searchParams";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type AnalysesListSearch = {
	page: number;
};

function validateAnalysesListSearch(
	input: Partial<AnalysesListSearch> & SearchSchemaInput,
): AnalysesListSearch {
	return { page: num(input.page, 1) };
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
