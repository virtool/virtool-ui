import { num, str } from "@app/searchParams";
import OtuList from "@otus/components/OtuList";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

/** Search params for this route. */
type OtuListSearch = {
	find: string;
	page: number;
};

function validateOtuListSearch(
	input: Partial<OtuListSearch> & SearchSchemaInput,
): OtuListSearch {
	return {
		find: str(input.find, ""),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/refs/$refId/otus/")({
	validateSearch: validateOtuListSearch,
	loaderDeps: ({ search: { find, page } }) => ({ find, page }),
	loader: async ({
		context: { queryClient },
		params: { refId },
		deps: { find, page },
	}) => {
		const { otusQueryOptions } = await import("@otus/queries");
		await queryClient.ensureQueryData(otusQueryOptions(refId, page, 25, find));
	},
	component: OtusRoute,
});

function OtusRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<OtuList
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
