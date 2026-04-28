import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { CurrentOtuContextProvider, useFetchOTU } from "@otus/queries";
import { useFetchReference } from "@references/queries";
import { getRouteApi } from "@tanstack/react-router";
import OtuIssues from "../OtuIssues";
import AddIsolate from "./Isolates/AddIsolate";
import IsolateEditor from "./Isolates/IsolateEditor";
import { useOtuDetailSearch } from "./OtuDetailSearchContext";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Displays a component for managing the OTU
 */
export default function OtuSection() {
	const { otuId, refId } = routeApi.useParams();
	const { search, setSearch } = useOtuDetailSearch();

	const { data: reference, isPending: isPendingReference } =
		useFetchReference(refId);
	const { data: otu, isPending: isPendingOTU } = useFetchOTU(otuId);

	if (isPendingReference || isPendingOTU) {
		return <LoadingPlaceholder />;
	}

	return (
		<CurrentOtuContextProvider otuId={otuId} refId={refId}>
			{otu.issues && <OtuIssues issues={otu.issues} isolates={otu.isolates} />}
			<IsolateEditor />
			<AddIsolate
				allowedSourceTypes={reference.source_types}
				otuId={otuId}
				restrictSourceTypes={reference.restrict_source_types}
				show={Boolean(search.openAddIsolate)}
				onHide={() => setSearch({ openAddIsolate: false })}
			/>
		</CurrentOtuContextProvider>
	);
}
