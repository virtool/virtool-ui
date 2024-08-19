import { ErrorResponse } from "@/types/types";
import { keepPreviousData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createGroup, findGroups, getGroup, removeGroup, updateGroup } from "./api";
import { Group, GroupMinimal, GroupSearchResults, PermissionsUpdate } from "./types";

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
 * @returns A paginated list of the group search results
 */
export function useInfiniteFindGroups(per_page: number, term: string) {
    return useInfiniteQuery<GroupSearchResults>({
        queryKey: groupQueryKeys.infiniteList([per_page, term]),
        queryFn: ({ pageParam }) =>
            findGroups(pageParam as number, per_page, term, true) as Promise<GroupSearchResults>,
        initialPageParam: 1,
        getNextPageParam: lastPage => {
            if (lastPage.page >= lastPage.page_count) {
                return undefined;
            }
            return (lastPage.page || 1) + 1;
        },
        placeholderData: keepPreviousData,
    });
}

/**
 * Gets a non-paginated list of all groups
 *
 * @returns A non-paginated list of groups
 */
export function useListGroups() {
    return useQuery<GroupMinimal[]>({
        queryKey: groupQueryKeys.lists(),
        queryFn: () => findGroups() as Promise<GroupMinimal[]>,
    });
}

/**
 * Fetches a single group
 *
 * @param id - The id of the group to fetch
 * @returns A non-paginated list of groups
 */
export function useFetchGroup(id: string | number) {
    return useQuery<Group>({
        queryKey: groupQueryKeys.detail(id),
        queryFn: () => getGroup(id),
        enabled: Boolean(id),
        placeholderData: keepPreviousData,
    });
}

/**
 * Initializes a mutator for updating a group
 *
 * @returns A mutator for updating a group
 */
export function useUpdateGroup() {
    const queryClient = useQueryClient();
    return useMutation<
        Group,
        ErrorResponse,
        {
            id: string | number;
            name?: string;
            permissions?: PermissionsUpdate;
        }
    >({
        mutationFn: ({ id, name, permissions }) => updateGroup(id, name, permissions),
        onSuccess: data => {
            queryClient.invalidateQueries({ queryKey: groupQueryKeys.lists() });
            queryClient.setQueryData(groupQueryKeys.detail(data.id), data);
        },
    });
}

/**
 * Initializes a mutator for removing a group
 *
 * @returns A mutator for removing a group
 */
export function useRemoveGroup() {
    const queryClient = useQueryClient();
    return useMutation<null, ErrorResponse, { id: string | number }>({
        mutationFn: ({ id }) => removeGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupQueryKeys.all() });
        },
    });
}

/**
 * Initializes a mutator for creating a group
 *
 * @returns A mutator for creating a group
 */
export function useCreateGroup() {
    const queryClient = useQueryClient();
    return useMutation<Group, Error, { name: string }>({
        mutationFn: ({ name }) => createGroup(name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: groupQueryKeys.lists() });
        },
    });
}
