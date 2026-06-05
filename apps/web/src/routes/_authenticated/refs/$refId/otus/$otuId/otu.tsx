import OtuSection from "@otus/components/Detail/OtuSection";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const otuTabSearchSchema = z.object({
	activeIsolate: z.string().optional().catch(undefined),
});

export const Route = createFileRoute(
	"/_authenticated/refs/$refId/otus/$otuId/otu",
)({
	validateSearch: otuTabSearchSchema,
	component: OtuSection,
});
