import { num, str } from "@app/searchParams";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { ManageUsers } from "@users/components/ManageUsers";

/** Search params for the user administration list. */
type UsersSearch = {
	status: string;
	page: number;
};

function validateUsersSearch(
	input: Partial<UsersSearch> & SearchSchemaInput,
): UsersSearch {
	return {
		status: str(input.status, "active"),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/administration/users/")({
	validateSearch: validateUsersSearch,
	loaderDeps: ({ search: { page, status } }) => ({ page, status }),
	loader: async ({ context: { queryClient }, deps: { page, status } }) => {
		const [{ usersQueryOptions }, { passwordPolicyQueryOptions }] =
			await Promise.all([
				import("@users/queries"),
				import("@administration/passwordPolicy"),
			]);

		return Promise.all([
			queryClient.ensureQueryData(
				usersQueryOptions(page, 25, "", undefined, status === "active"),
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
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
			status={search.status}
		/>
	);
}
