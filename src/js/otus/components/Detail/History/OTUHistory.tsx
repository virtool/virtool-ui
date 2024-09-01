import { LoadingPlaceholder } from "@base";
import HistoryList from "@otus/components/Detail/History/HistoryList";
import { useFetchOTUHistory } from "@otus/queries";
import { groupBy } from "lodash-es";
import React from "react";
import { useParams } from "react-router-dom-v5-compat";

/**
 * Display and manage the history for the OTU
 */
export default function OTUHistory() {
    const { otuId } = useParams();
    const { data, isPending } = useFetchOTUHistory(otuId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const changes = groupBy(data, change => (change.index.version === "unbuilt" ? "unbuilt" : "built"));

    return (
        <div>
            {changes.unbuilt && <HistoryList history={changes.unbuilt} unbuilt />}
            {changes.built && <HistoryList history={changes.built} />}
        </div>
    );
}
