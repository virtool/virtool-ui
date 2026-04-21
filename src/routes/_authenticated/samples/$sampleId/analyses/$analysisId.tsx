import AnalysisDetail from "@analyses/components/AnalysisDetail";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/analyses/$analysisId",
)({
	component: AnalysisDetail,
});
