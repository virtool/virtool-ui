import Rights from "@samples/components/Detail/SampleRights";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/rights",
)({
	component: Rights,
});
