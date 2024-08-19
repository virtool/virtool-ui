import { LoadingPlaceholder } from "@base";
import HistoryList from "@otus/components/Detail/History/HistoryList";
import { useFetchOTUHistory } from "@otus/queries";
import { groupBy } from "lodash-es";
import React from "react";
import { match } from "react-router-dom";

type OTUHistoryProps = {
    /** Match object containing path information */
    match: match<{ otuId: string }>;
};

/**
 * Display and manage the history for the OTU
 */
export default function OTUHistory({ match }: OTUHistoryProps) {
    const { otuId } = match.params;
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
