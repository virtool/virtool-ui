import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { CurrentOtuContextProvider, useFetchOTU } from "@otus/queries";
import { useFetchReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import OtuIssues from "../OtuIssues";
import IsolateEditor from "./Isolates/IsolateEditor";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Displays a component for managing the OTU
 */
export default function OtuSection() {
	const { otuId, refId } = routeApi.useParams();

	const { isPending: isPendingReference } = useFetchReference(refId);
	const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);

	if (isPendingReference || isPendingOTU) {
		return <LoadingPlaceholder />;
	}

	return (
		<CurrentOtuContextProvider otuId={otuId} refId={refId}>
			{otu.issues && <OtuIssues issues={otu.issues} isolates={otu.isolates} />}
			<IsolateEditor />
		</CurrentOtuContextProvider>
	);
}
