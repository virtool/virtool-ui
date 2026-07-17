import { DEFAULT_PER_PAGE, type Paginated, paginated } from "@app/pagination";
import { bool, str } from "@app/searchParams";
import ReferenceList from "@references/components/ReferenceList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for the references list. */
type RefsSearch = Paginated & {
	archived: boolean;
	term: string;
};

function validateRefsSearch(
	input: Partial<RefsSearch> & SearchSchemaInput,
): RefsSearch {
	return {
		...paginated(input),
		archived: bool(input.archived, false),
		term: str(input.term, ""),
	};
}

export const Route = createFileRoute("/_authenticated/refs/")({
	validateSearch: validateRefsSearch,
	loaderDeps: ({ search: { archived, term, page } }) => ({
		archived,
		term,
		page,
	}),
	loader: async ({
		context: { queryClient },
		deps: { archived, term, page },
	}) => {
		const { referencesQueryOptions } = await import("@references/queries");
		await queryClient.ensureQueryData(
			referencesQueryOptions(page, DEFAULT_PER_PAGE, term, archived),
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
			term={search.term}
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
