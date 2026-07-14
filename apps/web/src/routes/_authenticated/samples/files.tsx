import { num } from "@app/searchParams";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import { useFetchLabels } from "@labels/queries";
import SampleFileManager from "@samples/components/SampleFileManager";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type SampleFilesSearch = {
	page: number;
};

function validateSampleFilesSearch(
	input: Partial<SampleFilesSearch> & SearchSchemaInput,
): SampleFilesSearch {
	return { page: num(input.page, 1) };
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
