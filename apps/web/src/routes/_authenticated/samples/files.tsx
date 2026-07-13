import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
import { useFetchLabels } from "@labels/queries";
import SampleFileManager from "@samples/components/SampleFileManager";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const sampleFilesSearchSchema = z.object({
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/samples/files")({
	validateSearch: sampleFilesSearchSchema,
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
