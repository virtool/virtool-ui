import { useInfiniteQuery, useQuery } from "react-query";
import { Request } from "../app/request";
import { findIndexes } from "./api";
import { IndexSearchResult } from "./types";

/**
 * Factory for generating react-query keys for index related queries.
 */
export const indexQueryKeys = {
    all: () => ["indexes"] as const,
    lists: () => ["indexes", "list"] as const,
    list: (filters: string[]) => ["indexes", "list", ...filters] as const,
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
 * Retrieves a list of indexes that are ready
 */
export function listReadyIndexes() {
    return Request.get("/indexes")
        .query({ ready: true })
        .then(res => res.body);
}

/**
 * Fetches a list of ready indexes
 */
export function useListReadyIndexes() {
    return useQuery("listReadyIndex", listReadyIndexes);
}
