import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchLabels } from "@labels/queries";
import CreateSample from "@samples/components/Create/CreateSample";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/samples/create")({
	component: CreateSampleRoute,
});

function CreateSampleRoute() {
	const { data: labels, isPending } = useFetchLabels();

	if (isPending || !labels) {
		return <LoadingPlaceholder />;
	}

	return <CreateSample labels={labels} />;
}
