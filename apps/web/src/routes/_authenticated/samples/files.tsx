import { type Paginated, paginated } from "@app/pagination";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import { useFetchLabels } from "@labels/queries";
import SampleFileManager from "@samples/components/SampleFileManager";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

function validateSampleFilesSearch(
	input: Partial<Paginated> & SearchSchemaInput,
): Paginated {
	return paginated(input);
}

export const Route = createFileRoute("/_authenticated/samples/files")({
	validateSearch: validateSampleFilesSearch,
	component: SampleFilesRoute,
});

function SampleFilesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();
	const { data: labels, isPending, isError } = useFetchLabels();

	if (isError && !labels) {
		return <QueryError noun="labels" />;
	}

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<SampleFileManager
			labels={labels}
			page={search.page}
			setPage={(page) => navigate({ search: { ...search, page } })}
		/>
	);
}
