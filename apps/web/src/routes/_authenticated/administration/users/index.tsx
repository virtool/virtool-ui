import { DEFAULT_PER_PAGE, type Paginated, paginated } from "@app/pagination";
import { str } from "@app/searchParams";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ManageUsers } from "@users/components/ManageUsers";

/** Search params for the user administration list. */
type UsersSearch = Paginated & {
	status: string;
	term: string;
};

function validateUsersSearch(
	input: Partial<UsersSearch> & SearchSchemaInput,
): UsersSearch {
	return {
		...paginated(input),
		status: str(input.status, "active"),
		term: str(input.term, ""),
	};
}

export const Route = createFileRoute("/_authenticated/administration/users/")({
	validateSearch: validateUsersSearch,
	loaderDeps: ({ search: { page, status, term } }) => ({ page, status, term }),
	loader: async ({
		context: { queryClient },
		deps: { page, status, term },
	}) => {
		const [{ usersQueryOptions }, { passwordPolicyQueryOptions }] =
			await Promise.all([
				import("@users/queries"),
				import("@administration/passwordPolicy"),
			]);

		return Promise.all([
			queryClient.ensureQueryData(
				usersQueryOptions(
					page,
					DEFAULT_PER_PAGE,
					term,
					undefined,
					status === "active",
				),
			),
			// For the create-user form. Prefetched, not ensured: a failure here must
			// not take down the page.
			queryClient.prefetchQuery(passwordPolicyQueryOptions()),
		]);
	},
	component: UsersRoute,
});

function UsersRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ManageUsers
			page={search.page}
			setSearch={(next, options) =>
				navigate({
					search: { ...search, ...next },
					replace: options?.replace,
				})
			}
			status={search.status}
			term={search.term}
		/>
	);
}
