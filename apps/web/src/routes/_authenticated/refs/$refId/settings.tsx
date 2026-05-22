import ReferenceSettings from "@references/components/Detail/ReferenceSettings";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const settingsSearchSchema = z.object({
	openAddUser: z.boolean().optional().catch(undefined),
	openAddGroup: z.boolean().optional().catch(undefined),
	editUserId: z.string().optional().catch(undefined),
	editGroupId: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/refs/$refId/settings")({
	validateSearch: settingsSearchSchema,
	component: ReferenceSettingsRoute,
});

function ReferenceSettingsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<ReferenceSettings
			editGroupId={search.editGroupId}
			editUserId={search.editUserId}
			openAddGroup={Boolean(search.openAddGroup)}
			openAddUser={Boolean(search.openAddUser)}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
