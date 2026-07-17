import { DEFAULT_PER_PAGE, type Paginated, paginated } from "@app/pagination";
import { str } from "@app/searchParams";
import HmmList from "@hmm/components/HmmList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type HmmSearch = Paginated & {
	term: string;
};

function validateHmmSearch(
	input: Partial<HmmSearch> & SearchSchemaInput,
): HmmSearch {
	return {
		...paginated(input),
		term: str(input.term, ""),
	};
}

export const Route = createFileRoute("/_authenticated/hmms/")({
	validateSearch: validateHmmSearch,
	loaderDeps: ({ search: { term, page } }) => ({ term, page }),
	loader: async ({ context: { queryClient }, deps: { term, page } }) => {
		const { hmmsQueryOptions } = await import("@hmm/queries");
		await queryClient.ensureQueryData(
			hmmsQueryOptions(page, DEFAULT_PER_PAGE, term),
		);
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
