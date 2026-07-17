import { num, str } from "@app/searchParams";
import OtuList from "@otus/components/OtuList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type OtuListSearch = {
	term: string;
	page: number;
};

function validateOtuListSearch(
	input: Partial<OtuListSearch> & SearchSchemaInput,
): OtuListSearch {
	return {
		term: str(input.term, ""),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/refs/$refId/otus/")({
	validateSearch: validateOtuListSearch,
	loaderDeps: ({ search: { term, page } }) => ({ term, page }),
	loader: async ({
		context: { queryClient },
		params: { refId },
		deps: { term, page },
	}) => {
		const { otusQueryOptions } = await import("@otus/queries");
		await queryClient.ensureQueryData(otusQueryOptions(refId, page, 25, term));
	},
	component: OtusRoute,
});

function OtusRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<OtuList
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
