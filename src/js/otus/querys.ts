import { useInfiniteQuery, useMutation } from "react-query";
import { addIsolate, findOTUs } from "./api";
import { OTUSearchResult } from "./types";

/**
 * Factory for generating react-query keys for otu related queries.
 */
export const OTUQueryKeys = {
    all: () => ["OTU"] as const,
    lists: () => ["OTU", "list"] as const,
    list: (filters: string[]) => ["OTU", "list", ...filters] as const,
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
 * @returns {UseQueryResult} The paginated list of indexes
 */
export function useInfiniteFindOTUS(refId: string, term: string, verified) {
    return useInfiniteQuery<OTUSearchResult>(
        OTUQueryKeys.infiniteList([refId]),
        ({ pageParam }) => findOTUs({ page: pageParam, refId, term, verified }),
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
 * Initializes a mutator for creating an OTU isolate
 *
 * @returns A mutator for creating an OTU isolate
 */
export function useCreateIsolate() {
    return useMutation<unknown, unknown, { otuId: string; sourceType: string; sourceName: string }>(
        ({ otuId, sourceType, sourceName }) => addIsolate(otuId, sourceType, sourceName),
    );
}
