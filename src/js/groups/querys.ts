import { useMutation, useQuery, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { createGroup, getGroup, listGroups, removeGroup, updateGroup } from "./api";
import { Group, GroupMinimal, GroupUpdate } from "./types";

/**
 * Factory for generating react-query keys for group-related queries.
 */
export const groupQueryKeys = {
    all: () => ["groups"] as const,
    lists: () => ["groups", "list"] as const,
    list: filters => ["groups", "list", ...filters] as const,
    details: () => ["groups", "details"] as const,
    detail: id => ["groups", "detail", id] as const,
};

/**
 * Gets a non-paginated list of all groups.
 *
 * @returns {UseQueryResult} The non-paginated list of groups.
 */
export function useListGroups() {
    return useQuery<GroupMinimal[]>(groupQueryKeys.lists(), listGroups);
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
