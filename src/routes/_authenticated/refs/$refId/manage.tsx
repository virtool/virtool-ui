import ReferenceManager from "@references/components/Detail/ReferenceManager";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const manageSearchSchema = z.object({
	openAddUser: z.boolean().optional().catch(undefined),
	openAddGroup: z.boolean().optional().catch(undefined),
	editUserId: z.string().optional().catch(undefined),
	editGroupId: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/refs/$refId/manage")({
	validateSearch: manageSearchSchema,
	component: ReferenceManager,
});
