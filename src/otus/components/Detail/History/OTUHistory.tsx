import { groupBy } from "lodash-es";
import React from "react";
import { usePathParams } from "../../../../app/hooks";
import LoadingPlaceholder from "../../../../base/LoadingPlaceholder";
import { useFetchOTUHistory } from "../../../queries";
import HistoryList from "./HistoryList";

/**
 * Display and manage the history for the OTU
 */
export default function OTUHistory() {
    const { otuId } = usePathParams<{ otuId: string }>();
    const { data, isPending } = useFetchOTUHistory(otuId);

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const changes = groupBy(data, (change) =>
        change.index.version === "unbuilt" ? "unbuilt" : "built",
    );

    return (
        <div>
            {changes.unbuilt && (
                <HistoryList history={changes.unbuilt} unbuilt />
            )}
            {changes.built && <HistoryList history={changes.built} />}
        </div>
    );
}
