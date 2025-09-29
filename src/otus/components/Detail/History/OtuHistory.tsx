import { usePathParams } from "@app/hooks";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import { useFetchOtuHistory } from "@otus/queries";
import { groupBy } from "lodash-es";
import HistoryList from "./HistoryList";

/**
 * Display and manage the history for the OTU
 */
export default function OtuHistory() {
    const { otuId } = usePathParams<{ otuId: string }>();
    const { data, isPending } = useFetchOtuHistory(otuId);

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
