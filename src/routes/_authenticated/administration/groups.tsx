import Groups from "@groups/components/Groups";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	openCreateGroup: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/administration/groups")({
	validateSearch: searchSchema,
	component: GroupsRoute,
});

function GroupsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<Groups
			openCreateGroup={Boolean(search.openCreateGroup)}
			setOpenCreateGroup={(openCreateGroup) =>
				navigate({ search: { ...search, openCreateGroup } })
			}
		/>
	);
}
