import { num } from "@app/searchParams";
import { SubtractionFileManager } from "@subtraction/components/SubtractionFileManager";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type SubtractionFilesSearch = {
	page: number;
};

function validateSubtractionFilesSearch(
	input: Partial<SubtractionFilesSearch> & SearchSchemaInput,
): SubtractionFilesSearch {
	return { page: num(input.page, 1) };
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
