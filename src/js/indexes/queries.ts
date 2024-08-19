import { ErrorResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createIndex, findIndexes, getIndex, getUnbuiltChanges, listIndexes } from "./api";
import { Index, IndexMinimal, IndexSearchResult, UnbuiltChangesSearchResults } from "./types";

/**
 * Factory for generating react-query keys for index related queries.
 */
export const indexQueryKeys = {
    all: () => ["indexes"] as const,
    lists: () => ["indexes", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["indexes", "list", ...filters] as const,
    infiniteLists: () => ["indexes", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["indexes", "list", "infinite", ...filters] as const,
    details: () => ["indexes", "details"] as const,
    detail: (id: string) => ["indexes", "detail", id] as const,
};

/**
 * Gets a paginated list of indexes.
 *
 * @param page - The page to fetch
 * @param per_page - The number of hmms to fetch per page
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @returns The paginated list of indexes
 */
export function useInfiniteFindIndexes(refId: string, term?: string) {
    return useInfiniteQuery<IndexSearchResult>({
        queryKey: indexQueryKeys.infiniteList([refId]),
        queryFn: ({ pageParam }) => findIndexes({ page: pageParam as number, refId, term }),
        initialPageParam: 1,
        getNextPageParam: lastPage => {
            if (lastPage.page >= lastPage.page_count) {
                return undefined;
            }
            return (lastPage.page || 1) + 1;
        },
    });
}

/**
 * Gets a list of ready indexes
 *
 * @returns A list of ready indexes
 */
export function useListIndexes(ready: boolean, term?: string) {
    return useQuery<IndexMinimal[]>({
        queryKey: indexQueryKeys.list([ready]),
        queryFn: () => listIndexes({ ready, term }),
    });
}

/**
 * Fetches a single index
 *
 * @param indexId - The id of the index to fetch
 * @returns A single index
 */
export function useFetchIndex(indexId: string) {
    return useQuery<Index, ErrorResponse>({
        queryKey: indexQueryKeys.detail(indexId),
        queryFn: () => getIndex(indexId),
    });
}

/**
 * Get a list of unbuilt changes for a reference
 *
 * @param refId - The id of the reference to fetch unbuilt changes for
 * @returns A list of unbuilt changes for a reference
 */
export function useFetchUnbuiltChanges(refId: string) {
    return useQuery<UnbuiltChangesSearchResults>({
        queryKey: indexQueryKeys.detail(refId),
        queryFn: () => getUnbuiltChanges(refId),
    });
}

/**
 * Initializes a mutator for creating an index
 *
 * @returns A mutator for creating an index
 */
export function useCreateIndex() {
    const queryClient = useQueryClient();
    return useMutation<Index, ErrorResponse, { refId: string }>({
        mutationFn: ({ refId }) => createIndex(refId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: indexQueryKeys.infiniteLists() });
        },
    });
}
