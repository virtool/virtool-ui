import { DEFAULT_PER_PAGE, type Paginated, paginated } from "@app/pagination";
import { str } from "@app/searchParams";
import SubtractionList from "@subtraction/components/SubtractionList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type SubtractionsSearch = Paginated & {
	term: string;
};

function validateSubtractionsSearch(
	input: Partial<SubtractionsSearch> & SearchSchemaInput,
): SubtractionsSearch {
	return {
		...paginated(input),
		term: str(input.term, ""),
	};
}

export const Route = createFileRoute("/_authenticated/subtractions/")({
	validateSearch: validateSubtractionsSearch,
	loaderDeps: ({ search: { term, page } }) => ({ term, page }),
	loader: async ({ context: { queryClient }, deps: { term, page } }) => {
		const { subtractionsQueryOptions } = await import("@subtraction/queries");
		await queryClient.ensureQueryData(
			subtractionsQueryOptions(page, DEFAULT_PER_PAGE, term),
		);
	},
	component: SubtractionsRoute,
});

function SubtractionsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<SubtractionList
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
