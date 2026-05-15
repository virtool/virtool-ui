import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import SampleFileSizeWarning from "@samples/components/Detail/SampleFileSizeWarning";
import { useFetchSample } from "@samples/queries";
import { getRouteApi } from "@tanstack/react-router";
import SampleFilesMessage from "../SampleFilesMessage";
import SampleReads from "./SampleReads";

const routeApi = getRouteApi("/_authenticated/samples/$sampleId");

/**
 * The uploads view in sample details
 */
export default function SampleDetailFiles() {
	const { sampleId } = routeApi.useParams();
	const { data, isPending } = useFetchSample(sampleId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	return (
		<ContainerNarrow>
			<SampleFileSizeWarning reads={data.reads} sampleId={data.id} />
			<SampleFilesMessage showLegacy={data.is_legacy} />
			<SampleReads reads={data.reads} sampleName={data.name} />
		</ContainerNarrow>
	);
}
