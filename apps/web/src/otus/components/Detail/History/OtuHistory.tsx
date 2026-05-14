import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchOtuHistory } from "@otus/queries";
import { getRouteApi } from "@tanstack/react-router";
import { groupBy } from "es-toolkit";
import HistoryList from "./HistoryList";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Display and manage the history for the OTU
 */
export default function OtuHistory() {
	const { otuId } = routeApi.useParams();
	const { data, isPending } = useFetchOtuHistory(otuId);

	if (isPending) {
		return <LoadingPlaceholder />;
	}

	const changes = groupBy(data, (change) =>
		change.index.version === "unbuilt" ? "unbuilt" : "built",
	);

	return (
		<div>
			{changes.unbuilt && <HistoryList history={changes.unbuilt} unbuilt />}
			{changes.built && <HistoryList history={changes.built} />}
		</div>
	);
}
