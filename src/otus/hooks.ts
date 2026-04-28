import { useOtuDetailSearch } from "@otus/components/Detail/OtuDetailSearchContext";
import type { Otu, OtuIsolate } from "./types";

/**
 * A hook to get the active isolate
 *
 * @param otu - The OTU to get the isolate from
 * @returns The active isolate
 */
export function useActiveIsolate(otu: Otu): OtuIsolate | undefined {
	const { search } = useOtuDetailSearch();
	const activeIsolate = search.activeIsolate;
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
	const { search } = useOtuDetailSearch();
	const activeIsolate = search.activeIsolate;

	return activeIsolate || otu.isolates[0]?.id;
}
