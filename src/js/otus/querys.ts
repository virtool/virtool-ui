import { useInfiniteQuery, useMutation } from "react-query";
import { ErrorResponse } from "../types/types";
import { addIsolate, createOTU, editIsolate, findOTUs, removeIsolate, removeOTU, setIsolateAsDefault } from "./api";
import { OTU, OTUIsolate, OTUSearchResult } from "./types";

/**
 * Factory for generating react-query keys for otu related queries.
 */
export const OTUQueryKeys = {
    all: () => ["OTU"] as const,
    lists: () => ["OTU", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["OTU", "list", ...filters] as const,
    infiniteLists: () => ["OTU", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["OTU", "list", "infinite", ...filters] as const,
    details: () => ["OTU", "details"] as const,
    detail: (id: string) => ["OTU", "detail", id] as const,
};

/**
 * Gets a paginated list of OTUs.
 *
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @param verified - Filter the results to verified OTUs only
 * @returns The paginated list of indexes
 */
export function useInfiniteFindOTUS(refId: string, term: string, verified?: boolean) {
    return useInfiniteQuery<OTUSearchResult>(
        OTUQueryKeys.infiniteList([refId, term]),
        ({ pageParam }) => findOTUs({ refId, term, verified, page: pageParam }),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
            keepPreviousData: true,
        },
    );
}

/**
 * Initializes a mutator for creating an OTU
 *
 * @returns A mutator for creating an OTU
 */
export function useCreateOTU(refId: string) {
    return useMutation<OTU, ErrorResponse, { name: string; abbreviation: string }>(({ name, abbreviation }) =>
        createOTU(refId, name, abbreviation),
    );
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveOTU() {
    return useMutation<null, ErrorResponse, { otuId: string }>(({ otuId }) => removeOTU(otuId));
}

/**
 * Initializes a mutator for creating an OTU isolate
 *
 * @returns A mutator for creating an OTU isolate
 */
export function useCreateIsolate() {
    return useMutation<OTUIsolate, unknown, { otuId: string; sourceType: string; sourceName: string }>(
        ({ otuId, sourceType, sourceName }) => addIsolate(otuId, sourceType, sourceName),
    );
}

/**
 * Initializes a mutator for setting an isolate as the default resource for an OTU
 *
 * @returns A mutator for setting an isolate as the default resource for an OTU
 */
export function useSetIsolateAsDefault() {
    return useMutation<OTUIsolate, ErrorResponse, { otuId: string; isolateId: string }>(({ otuId, isolateId }) =>
        setIsolateAsDefault(otuId, isolateId),
    );
}

/**
 * Initializes a mutator for editing an OTU isolate
 *
 * @returns A mutator for editing an OTU isolate
 */
export function useUpdateIsolate() {
    return useMutation<
        OTUIsolate,
        unknown,
        { otuId: string; isolateId: string; sourceType: string; sourceName: string }
    >(({ otuId, isolateId, sourceType, sourceName }) => editIsolate(otuId, isolateId, sourceType, sourceName));
}

/**
 * Initializes a mutator for removing an OTU isolate
 *
 * @returns A mutator for removing an OTU isolate
 */
export function useRemoveIsolate() {
    return useMutation<null, ErrorResponse, { otuId: string; isolateId: string }>(({ otuId, isolateId }) =>
        removeIsolate(otuId, isolateId),
    );
}
