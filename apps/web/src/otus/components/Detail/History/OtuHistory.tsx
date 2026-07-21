import { useSuspenseOtuHistory } from "@otus/queries";
import { getRouteApi } from "@tanstack/react-router";
import { groupBy } from "es-toolkit";
import HistoryList from "./HistoryList";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * Display the history for the OTU
 */
export default function OtuHistory() {
	const { otuId } = routeApi.useParams();
	const { data } = useSuspenseOtuHistory(otuId);

	const changes = groupBy(data, (change) =>
		change.index === null ? "unbuilt" : "built",
	);

	return (
		<div>
			{changes.unbuilt && <HistoryList history={changes.unbuilt} unbuilt />}
			{changes.built && <HistoryList history={changes.built} />}
		</div>
	);
}
