import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchLabels } from "@labels/queries";
import SampleDetailGeneral from "@samples/components/Detail/SampleDetailGeneral";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
	"/_authenticated/samples/$sampleId/general",
)({
	component: SampleDetailGeneralRoute,
});

function SampleDetailGeneralRoute() {
	const { data: labels, isPending } = useFetchLabels();

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return <SampleDetailGeneral labels={labels} />;
}
