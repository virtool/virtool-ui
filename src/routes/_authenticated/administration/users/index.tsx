import { createFileRoute } from "@tanstack/react-router";
import { ManageUsers } from "@users/components/ManageUsers";
import { z } from "zod";

const searchSchema = z.object({
	status: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
	openCreateUser: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/administration/users/")({
	validateSearch: searchSchema,
	component: ManageUsers,
});
