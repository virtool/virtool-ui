import { useInfiniteQuery, useMutation } from "react-query";
import { cloneReference, findReferences } from "./api";
import { ReferenceMinimal, ReferenceSearchResult } from "./types";

/**
 * Factory for generating react-query keys for reference related queries.
 */
export const referenceQueryKeys = {
    all: () => ["reference"] as const,
    lists: () => ["reference", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["reference", "list", "single", ...filters] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["reference", "list", "infinite", ...filters] as const,
};

/**
 * Gets a paginated list of references
 *
 * @param term - The search term to filter references by
 * @returns The paginated list of references
 */
export function useInfiniteFindReferences(term: string) {
    return useInfiniteQuery<ReferenceSearchResult>(
        referenceQueryKeys.infiniteList([term]),
        ({ pageParam }) => findReferences({ page: pageParam, per_page: 25, term }),
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
 * Initializes a mutator for cloning a reference
 *
 * @returns A mutator for cloning a reference
 */
export function useCloneReference() {
    return useMutation<ReferenceMinimal, unknown, { name: string; description: string; refId: string }>(cloneReference);
}
