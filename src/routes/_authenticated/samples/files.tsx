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

	return (
		<SampleFileManager
			page={search.page}
			setPage={(page) => navigate({ search: { ...search, page } })}
		/>
	);
}
