import AnalysesList from "@analyses/components/AnalysisList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const analysesListSearchSchema = z.object({
	page: z.number().default(1).catch(1),
	openCreateAnalysis: z.boolean().optional().catch(undefined),
});

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/",
)({
	validateSearch: analysesListSearchSchema,
	component: AnalysesList,
});
