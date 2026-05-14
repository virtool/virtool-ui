import { SubtractionFileManager } from "@subtraction/components/SubtractionFileManager";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const subtractionFilesSearchSchema = z.object({
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/subtractions/files")({
	validateSearch: subtractionFilesSearchSchema,
	component: SubtractionFilesRoute,
});

function SubtractionFilesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<SubtractionFileManager
			page={search.page}
			setPage={(page) => navigate({ search: { ...search, page } })}
		/>
	);
}
