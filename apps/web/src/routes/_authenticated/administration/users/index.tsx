import { passwordPolicyQueryOptions } from "@administration/queries";
import { createFileRoute } from "@tanstack/react-router";
import { ManageUsers } from "@users/components/ManageUsers";
import { usersQueryOptions } from "@users/queries";
import { z } from "zod";

const searchSchema = z.object({
	status: z.string().default("active").catch("active"),
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/administration/users/")({
	validateSearch: searchSchema,
	loaderDeps: ({ search: { page, status } }) => ({ page, status }),
	loader: ({ context: { queryClient }, deps: { page, status } }) =>
		Promise.all([
			queryClient.ensureQueryData(
				usersQueryOptions(page, 25, "", undefined, status === "active"),
			),
			// For the create-user form. Prefetched, not ensured: a failure here must
			// not take down the page.
			queryClient.prefetchQuery(passwordPolicyQueryOptions()),
		]),
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
