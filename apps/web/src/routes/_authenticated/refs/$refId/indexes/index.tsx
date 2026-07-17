import { num } from "@app/searchParams";
import Indexes from "@indexes/components/Indexes";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type IndexesSearch = {
	page: number;
};

function validateIndexesSearch(
	input: Partial<IndexesSearch> & SearchSchemaInput,
): IndexesSearch {
	return { page: num(input.page, 1) };
}

export const Route = createFileRoute("/_authenticated/refs/$refId/indexes/")({
	validateSearch: validateIndexesSearch,
	loaderDeps: ({ search: { page } }) => ({ page }),
	loader: async ({
		context: { queryClient },
		params: { refId },
		deps: { page },
	}) => {
		const { indexesQueryOptions } = await import("@indexes/queries");
		await queryClient.ensureQueryData(indexesQueryOptions(page, 25, refId));
	},
	component: IndexesRoute,
});

function IndexesRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<Indexes
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
