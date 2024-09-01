import { OTU } from "@otus/types";
import { find } from "lodash-es";
import { useLocation } from "react-router-dom-v5-compat";

/**
 * A hook to get the active isolate
 *
 * @param otu - The OTU to get the isolate from
 * @returns The active isolate
 */
export function useGetActiveIsolate(otu: OTU) {
    const location = useLocation();

    const activeIsolateId = location.state?.activeIsolateId || otu.isolates[0]?.id;
    return otu.isolates.length ? find(otu.isolates, { id: activeIsolateId }) : null;
}

/**
 * A hook to get the active isolate id
 *
 * @param otu - The OTU to get the isolate id from
 * @returns The unique identifier of the active isolate
 */
export function useGetActiveIsolateId(otu: OTU) {
    const location = useLocation();

    return location.state?.activeIsolateId || otu.isolates[0]?.id;
}
