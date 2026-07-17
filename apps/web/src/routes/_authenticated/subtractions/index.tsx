import { num, str } from "@app/searchParams";
import SubtractionList from "@subtraction/components/SubtractionList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type SubtractionsSearch = {
	find: string;
	page: number;
};

function validateSubtractionsSearch(
	input: Partial<SubtractionsSearch> & SearchSchemaInput,
): SubtractionsSearch {
	return {
		find: str(input.find, ""),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/subtractions/")({
	validateSearch: validateSubtractionsSearch,
	loaderDeps: ({ search: { find, page } }) => ({ find, page }),
	loader: async ({ context: { queryClient }, deps: { find, page } }) => {
		const { subtractionsQueryOptions } = await import("@subtraction/queries");
		await queryClient.ensureQueryData(subtractionsQueryOptions(page, 25, find));
	},
	component: SubtractionsRoute,
});

function SubtractionsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<SubtractionList
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
