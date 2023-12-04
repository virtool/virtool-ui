import { useInfiniteQuery } from "react-query";
import { findReferences } from "./api";
import { ReferenceSearchResult } from "./types";

/**
 * Factory for generating react-query keys for reference related queries.
 */
export const ReferenceQueryKeys = {
    all: () => ["reference"] as const,
    lists: () => ["reference", "list"] as const,
    list: (filters: (string | number)[]) => ["reference", "list", ...filters] as const,
    infiniteLists: () => ["users", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["users", "list", "infinite", ...filters] as const,
};

export const useInfiniteFindReferences = (term: string) => {
    return useInfiniteQuery<ReferenceSearchResult>(
        ReferenceQueryKeys.list([term]),
        pageParam => findReferences({ page: pageParam, per_page: 25, term }),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
        },
    );
};
