import SampleDetailGeneral from "@samples/components/Detail/SampleDetailGeneral";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/general",
)({
	component: SampleDetailGeneral,
});
