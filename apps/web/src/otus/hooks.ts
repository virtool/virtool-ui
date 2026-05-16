import { getRouteApi } from "@tanstack/react-router";
import type { Otu } from "./types";

const routeApi = getRouteApi("/_authenticated/refs/$refId/otus/$otuId");

/**
 * A hook to get the active isolate id
 *
 * @param otu - The OTU to get the isolate id from
 * @returns The unique identifier of the active isolate
 */
export function useGetActiveIsolateId(otu: Otu) {
	const { activeIsolate } = routeApi.useSearch();
	return activeIsolate || otu.isolates[0]?.id;
}
