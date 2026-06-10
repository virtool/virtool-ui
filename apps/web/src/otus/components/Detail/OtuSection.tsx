import LoadingPlaceholder from "@base/LoadingPlaceholder";
import QueryError from "@base/QueryError";
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

	const { isPending: isPendingReference, isError: isErrorReference } =
		useFetchReference(refId);
	const {
		data: otu,
		isPending: isPendingOTU,
		isError: isErrorOTU,
	} = useFetchOTU(otuId);

	if ((isErrorReference || isErrorOTU) && !otu) {
		return <QueryError noun="OTU" />;
	}

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
