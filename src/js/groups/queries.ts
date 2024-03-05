import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { createGroup, findGroups, getGroup, removeGroup, updateGroup } from "./api";
import { Group, GroupMinimal, GroupSearchResults, GroupUpdate } from "./types";

/**
 * Factory for generating react-query keys for group-related queries.
 */
export const groupQueryKeys = {
    all: () => ["groups"] as const,
    lists: () => ["groups", "list"] as const,
    list: filters => ["groups", "list", ...filters] as const,
    infiniteLists: () => ["groups", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["groups", "list", "infinite", ...filters] as const,
    details: () => ["groups", "details"] as const,
    detail: id => ["groups", "detail", id] as const,
};

/**
 * Setup query for fetching group search results for infinite scrolling view
 *
 * @param per_page - The number of groups to fetch per page
 * @param term - The search term to filter groups by
 * @returns An UseInfiniteQueryResult object containing the group search results
 */
export function useInfiniteFindGroups(per_page: number, term: string) {
    return useInfiniteQuery<GroupSearchResults>(
        groupQueryKeys.infiniteList([per_page, term]),
        ({ pageParam }) => findGroups(pageParam, per_page, term, true) as Promise<GroupSearchResults>,
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
 * Gets a non-paginated list of all groups.
 *
 * @returns {UseQueryResult} The non-paginated list of groups.
 */
export function useListGroups() {
    return useQuery<GroupMinimal[]>(groupQueryKeys.lists(), () => findGroups() as Promise<GroupMinimal[]>);
}

/**
 * Fetches a single group.
 *
 *
 * @param {string} id The id of the group to fetch.
 * @param {UseQueryOptions} options The react-query options to use.
 * @returns {UseQueryResult} The non-paginated list of groups.
 */
export function useFetchGroup(id: string | number, options: UseQueryOptions<Group>) {
    return useQuery<Group>(groupQueryKeys.detail(id), () => getGroup(id), options);
}

/**
 * Initializes a mutator for updating a group.
 *
 * @returns {UseMutationResult} mutator for updating a group.
 */
export function useUpdateGroup() {
    const queryClient = useQueryClient();
    return useMutation<Group, unknown, GroupUpdate>(updateGroup, {
        onSuccess: data => {
            queryClient.invalidateQueries(groupQueryKeys.lists());
            queryClient.setQueryData(groupQueryKeys.detail(data.id), data);
        },
    });
}

/**
 * Initializes a mutator for removing a group.
 *
 * @returns {UseMutationResult} mutator for removing a group
 */
export function useRemoveGroup() {
    const queryClient = useQueryClient();
    return useMutation(removeGroup, {
        onSuccess: () => {
            queryClient.invalidateQueries(groupQueryKeys.all());
        },
    });
}

/**
 * Initializes a mutator for creating a group
 *
 * @returns {UseMutationResult} mutator for creating a group
 */
export function useCreateGroup() {
    const queryClient = useQueryClient();
    return useMutation(createGroup, {
        onSuccess: () => {
            queryClient.invalidateQueries(groupQueryKeys.lists());
        },
    });
}
