import Quality from "@samples/components/SampleQuality";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/quality",
)({
	component: Quality,
});
