import { type Paginated, paginated } from "@app/pagination";
import { SubtractionFileManager } from "@subtraction/components/SubtractionFileManager";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

function validateSubtractionFilesSearch(
	input: Partial<Paginated> & SearchSchemaInput,
): Paginated {
	return paginated(input);
}

export const Route = createFileRoute("/_authenticated/subtractions/files")({
	validateSearch: validateSubtractionFilesSearch,
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
