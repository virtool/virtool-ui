import { ErrorResponse } from "@/types/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { createIndex, findIndexes, getUnbuiltChanges, listIndexes } from "./api";
import { Index, IndexMinimal, IndexSearchResult, UnbuiltChangesSearchResults } from "./types";

/**
 * Factory for generating react-query keys for index related queries.
 */
export const indexQueryKeys = {
    all: () => ["indexes"] as const,
    lists: () => ["indexes", "list"] as const,
    list: (filters: Array<string | boolean>) => ["indexes", "list", ...filters] as const,
    infiniteLists: () => ["indexes", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["indexes", "list", "infinite", ...filters] as const,
    details: () => ["indexes", "details"] as const,
    detail: (id: string) => ["indexes", "detail", id] as const,
};

/**
 * Gets a paginated list of indexes.
 *
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @returns The paginated list of indexes
 */
export function useInfiniteFindIndexes(refId: string, term?: string) {
    return useInfiniteQuery<IndexSearchResult>(
        indexQueryKeys.infiniteList([refId]),
        ({ pageParam }) => findIndexes({ page: pageParam, refId, term }),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
        },
    );
}

/**
 * Gets a list of ready indexes
 *
 * @returns A list of ready indexes
 */
export function useListIndexes(ready: boolean, term?: string) {
    return useQuery<IndexMinimal[]>(indexQueryKeys.list([ready]), () => listIndexes({ ready, term }));
}

/**
 * Get a list of unbuilt changes for a reference
 *
 * @param refId - The id of the reference to fetch unbuilt changes for
 * @returns A list of unbuilt changes for a reference
 */
export function useFetchUnbuiltChanges(refId: string) {
    return useQuery<UnbuiltChangesSearchResults>(indexQueryKeys.detail(refId), () => getUnbuiltChanges(refId));
}

/**
 * Initializes a mutator for creating an index
 *
 * @returns A mutator for creating an index
 */
export function useCreateIndex() {
    return useMutation<Index, ErrorResponse, { refId: string }>(({ refId }) => createIndex(refId));
}
