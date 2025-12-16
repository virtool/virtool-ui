import { useNaiveUrlSearchParam, useUrlSearchParam } from "@app/hooks";
import { Otu, OtuIsolate } from "./types";

/**
 * A hook to get the active isolate
 *
 * @param otu - The OTU to get the isolate from
 * @returns The active isolate
 */
export function useActiveIsolate(otu: Otu): OtuIsolate | undefined {
    const { value: activeIsolate } = useNaiveUrlSearchParam("activeIsolate");
    return otu.isolates.find(
        (isolate) => isolate.id === (activeIsolate || otu.isolates[0]?.id),
    );
}

/**
 * A hook to get the active isolate id
 *
 * @param otu - The OTU to get the isolate id from
 * @returns The unique identifier of the active isolate
 */
export function useGetActiveIsolateId(otu: Otu) {
    const { value: activeIsolate } = useUrlSearchParam("activeIsolate");

    return activeIsolate || otu.isolates[0]?.id;
}
