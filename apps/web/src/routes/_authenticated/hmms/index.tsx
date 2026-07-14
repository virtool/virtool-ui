import { num, str } from "@app/searchParams";
import HmmList from "@hmm/components/HmmList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type HmmSearch = {
	find: string;
	page: number;
};

function validateHmmSearch(
	input: Partial<HmmSearch> & SearchSchemaInput,
): HmmSearch {
	return {
		find: str(input.find, ""),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/hmms/")({
	validateSearch: validateHmmSearch,
	component: HmmRoute,
});

function HmmRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<HmmList
			find={search.find}
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
