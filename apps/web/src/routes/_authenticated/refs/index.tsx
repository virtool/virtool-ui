import { bool, num, str } from "@app/searchParams";
import ReferenceList from "@references/components/ReferenceList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for the references list. */
type RefsSearch = {
	archived: boolean;
	find: string;
	page: number;
};

function validateRefsSearch(
	input: Partial<RefsSearch> & SearchSchemaInput,
): RefsSearch {
	return {
		archived: bool(input.archived, false),
		find: str(input.find, ""),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/refs/")({
	validateSearch: validateRefsSearch,
	loaderDeps: ({ search: { archived, find, page } }) => ({
		archived,
		find,
		page,
	}),
	loader: async ({
		context: { queryClient },
		deps: { archived, find, page },
	}) => {
		const { referencesQueryOptions } = await import("@references/queries");
		await queryClient.ensureQueryData(
			referencesQueryOptions(page, 25, find, archived),
		);
	},
	component: ReferencesRoute,
});

function ReferencesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ReferenceList
			archived={search.archived}
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
