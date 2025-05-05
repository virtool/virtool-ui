import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "../types/types";
import {
    createIndex,
    findIndexes,
    getIndex,
    getUnbuiltChanges,
    listIndexes,
} from "./api";
import {
    Index,
    IndexMinimal,
    IndexSearchResult,
    UnbuiltChangesSearchResults,
} from "./types";

/**
 * Factory for generating react-query keys for index related queries.
 */
export const indexQueryKeys = {
    all: () => ["indexes"] as const,
    lists: () => ["indexes", "list"] as const,
    list: (filters: Array<string | number | boolean>) =>
        ["indexes", "list", ...filters] as const,
    infiniteLists: () => ["indexes", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) =>
        ["indexes", "list", "infinite", ...filters] as const,
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
export function useFindIndexes(
    page: number,
    per_page: number,
    refId: string,
    term?: string,
) {
    return useQuery<IndexSearchResult>({
        queryKey: indexQueryKeys.infiniteList([page, per_page, refId, term]),
        queryFn: () => findIndexes(page, per_page, refId, term),
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
        queryFn: () => getUnbuiltChanges(refId),
        queryKey: indexQueryKeys.detail(refId),
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
            queryClient.invalidateQueries({
                queryKey: indexQueryKeys.infiniteLists(),
            });
        },
    });
}
