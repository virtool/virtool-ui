import { ErrorResponse } from "@/types/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
    addIsolate,
    createOTU,
    editIsolate,
    editOTU,
    findOTUs,
    getOTU,
    removeIsolate,
    removeOTU,
    removeSequence,
    setIsolateAsDefault,
} from "./api";
import { OTU, OTUIsolate, OTUSearchResult, OTUSegment } from "./types";

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
 * Fetches a single OTU
 *
 * @param otuId - The id of the OTU to fetch
 * @returns A single OTU
 */
export function useFetchOTU(otuId: string) {
    return useQuery<OTU, ErrorResponse>(OTUQueryKeys.detail(otuId), () => getOTU(otuId), {
        retry: (failureCount, error) => {
            if (error.response?.status === 404) {
                return false;
            }
            return failureCount <= 3;
        },
    });
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

export type UpdateOTUProps = {
    otuId: string;
    name?: string;
    abbreviation?: string;
    schema?: OTUSegment[];
};

/**
 * Initializes a mutator for editing an OTU
 *
 * @returns A mutator for editing an OTU
 */
export function useUpdateOTU() {
    return useMutation<OTU, ErrorResponse, UpdateOTUProps>(({ otuId, name, abbreviation, schema }) =>
        editOTU(otuId, name, abbreviation, schema),
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

/**
 * Initializes a mutator for removing a sequence
 *
 * @returns A mutator for removing a sequence
 */
export function useRemoveSequence() {
    return useMutation<null, ErrorResponse, { otuId: string; isolateId: string; sequenceId: string }>(
        ({ otuId, isolateId, sequenceId }) => removeSequence(otuId, isolateId, sequenceId),
    );
}
