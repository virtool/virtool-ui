import OtuList from "@otus/components/OtuList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const otuListSearchSchema = z.object({
	find: z.string().default("").catch(""),
	page: z.number().default(1).catch(1),
	openCreateOTU: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute("/_authenticated/refs/$refId/otus/")({
	validateSearch: otuListSearchSchema,
	component: OtuList,
});
