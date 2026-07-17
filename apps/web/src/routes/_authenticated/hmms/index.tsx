import { num, str } from "@app/searchParams";
import HmmList from "@hmm/components/HmmList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type HmmSearch = {
	term: string;
	page: number;
};

function validateHmmSearch(
	input: Partial<HmmSearch> & SearchSchemaInput,
): HmmSearch {
	return {
		term: str(input.term, ""),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/hmms/")({
	validateSearch: validateHmmSearch,
	loaderDeps: ({ search: { term, page } }) => ({ term, page }),
	loader: async ({ context: { queryClient }, deps: { term, page } }) => {
		const { hmmsQueryOptions } = await import("@hmm/queries");
		await queryClient.ensureQueryData(hmmsQueryOptions(page, 25, term));
	},
	component: HmmRoute,
});

function HmmRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<HmmList
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
