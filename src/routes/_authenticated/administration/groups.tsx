import Groups from "@groups/components/Groups";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	openCreateGroup: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/administration/groups")({
	validateSearch: searchSchema,
	component: Groups,
});
