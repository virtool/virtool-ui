import ManageAdministrators from "@administration/components/AdministratorList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute(
	"/_authenticated/administration/administrators",
)({
	validateSearch: searchSchema,
	component: ManageAdministrators,
});
