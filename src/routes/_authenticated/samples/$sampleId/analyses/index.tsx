import AnalysesList from "@analyses/components/AnalysisList";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/",
)({
	component: AnalysesList,
});
