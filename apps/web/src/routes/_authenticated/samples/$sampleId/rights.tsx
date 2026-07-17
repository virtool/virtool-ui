import SampleRights from "@samples/components/Detail/SampleRights";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/rights",
)({
	component: RouteComponent,
});

function RouteComponent() {
	const { sampleId } = Route.useParams();
	return <SampleRights sampleId={Number(sampleId)} />;
}
