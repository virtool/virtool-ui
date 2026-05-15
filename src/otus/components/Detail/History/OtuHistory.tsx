import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchOtuHistory } from "@otus/queries";
import { useReferenceIsArchived } from "@references/hooks";
import { getRouteApi } from "@tanstack/react-router";
import { groupBy } from "es-toolkit";
import HistoryList from "./HistoryList";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Display and manage the history for the OTU
 */
export default function OtuHistory() {
	const { otuId, refId } = routeApi.useParams();
	const { data, isPending } = useFetchOtuHistory(otuId);
	const archived = useReferenceIsArchived(refId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const changes = groupBy(data, (change) =>
		change.index.version === "unbuilt" ? "unbuilt" : "built",
	);

	return (
		<div>
			{archived && (
				<p className="mb-3 text-sm text-gray-500">Read only - archived</p>
			)}
			{changes.unbuilt && (
				<HistoryList archived={archived} history={changes.unbuilt} unbuilt />
			)}
			{changes.built && (
				<HistoryList archived={archived} history={changes.built} />
			)}
		</div>
	);
}
