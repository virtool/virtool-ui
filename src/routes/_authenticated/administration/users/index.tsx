import { createFileRoute } from "@tanstack/react-router";
import { ManageUsers } from "@users/components/ManageUsers";
import { z } from "zod";

const searchSchema = z.object({
	status: z.string().default("active").catch("active"),
	page: z.number().default(1).catch(1),
	openCreateUser: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/administration/users/")({
	validateSearch: searchSchema,
	component: UsersRoute,
});

function UsersRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ManageUsers
			openCreateUser={Boolean(search.openCreateUser)}
			page={search.page}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
			status={search.status}
		/>
	);
}
