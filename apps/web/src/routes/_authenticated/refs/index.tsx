import { bool, num, str, strOptional } from "@app/searchParams";
import ReferenceList from "@references/components/ReferenceList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for the references list. */
type RefsSearch = {
	archived: boolean;
	find: string;
	page: number;
	cloneReferenceId?: string;
};

function validateRefsSearch(
	input: Partial<RefsSearch> & SearchSchemaInput,
): RefsSearch {
	return {
		archived: bool(input.archived, false),
		find: str(input.find, ""),
		page: num(input.page, 1),
		cloneReferenceId: strOptional(input.cloneReferenceId),
	};
}

export const Route = createFileRoute("/_authenticated/refs/")({
	validateSearch: validateRefsSearch,
	component: ReferencesRoute,
});

function ReferencesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ReferenceList
			archived={search.archived}
			cloneReferenceId={search.cloneReferenceId}
			find={search.find}
			page={search.page}
			setSearch={(next, options) =>
				navigate({
					search: { ...search, ...next },
					replace: options?.replace,
				})
			}
		/>
	);
}
