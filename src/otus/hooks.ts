import { useNaiveUrlSearchParam, useUrlSearchParam } from "../app/hooks";
import { OTU } from "./types";
import { find } from "lodash-es";

/**
 * A hook to get the active isolate
 *
 * @param otu - The OTU to get the isolate from
 * @returns The active isolate
 */
export function useGetActiveIsolate(otu: OTU) {
    const { value: activeIsolate } = useNaiveUrlSearchParam("activeIsolate");

    const activeIsolateId = activeIsolate || otu.isolates[0]?.id;
    return otu.isolates.length
        ? find(otu.isolates, { id: activeIsolateId })
        : null;
}

/**
 * A hook to get the active isolate id
 *
 * @param otu - The OTU to get the isolate id from
 * @returns The unique identifier of the active isolate
 */
export function useGetActiveIsolateId(otu: OTU) {
    const { value: activeIsolate } = useUrlSearchParam("activeIsolate");

    return activeIsolate || otu.isolates[0]?.id;
}
