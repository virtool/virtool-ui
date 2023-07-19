import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { UserResponse } from "../users/types";
import { fetchAdministratorRoles, fetchSettings, findUsers, setAdministratorRole } from "./api";
import { AdministratorRole, AdministratorRoles } from "./types";

export const settingsKeys = {
    all: () => ["settings"] as const,
};

/**
 * Fetch the server wide settings from the backend
 *
 * @returns {UseQueryResult} Whether the user has the required role.
 */
export function useFetchSettings() {
    return useQuery(settingsKeys.all(), fetchSettings);
}

export const roleKeys = {
    all: () => ["roles"] as const,
};

/**
 * Fetch a list of valid administrator roles from the backend
 *
 * @returns {UseQueryResult} result of the query
 */
export const useGetAdministratorRoles = () => {
    return useQuery<AdministratorRole[]>(roleKeys.all(), fetchAdministratorRoles);
};

export const userKeys = {
    all: () => ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["users", "list", ...filters] as const,
    infiniteLists: () => ["users", "infiniteList"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["users", "infiniteList", ...filters] as const,
    details: () => ["users", "details"] as const,
    detail: (user_id: string) => ["users", "details", user_id] as const,
};

/**
 * Fetch a list users from the backend
 *
 * @param {number} page The page to fetch
 * @param {number} per_page The number of users to fetch per page
 * @param {string} term The search term to filter users by
 * @param {boolean} administrator filter the users by administrator status
 * @returns {UseQueryResult} result of the query
 */
export const useFindUsers = (page: number, per_page: number, term: string, administrator?: boolean) => {
    return useQuery<UserResponse>(
        userKeys.list([page, per_page, term, administrator]),
        () => findUsers(page, per_page, term, administrator),
        {
            keepPreviousData: true,
        },
    );
};

/**
 * Fetch a list users from the backend
 *
 * @param {number} per_page The number of users to fetch per page
 * @param {string} term The search term to filter users by
 * @param {boolean} administrator filter the users by administrator status
 * @returns {UseQueryResult} result of the query
 */
export const useInfiniteFindUsers = (per_page: number, term: string, administrator?: boolean) => {
    return useInfiniteQuery<UserResponse>(
        userKeys.infiniteList([per_page, term, administrator]),
        ({ pageParam }) => findUsers(pageParam, per_page, term, administrator),
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

/**
 * Set the administrator role of a user
 *
 * @returns {UseMutationResult} mutator for setting an administrator role
 */
export const useSetAdministratorRole = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ role, user_id }: { role: AdministratorRoles; user_id: string }) => setAdministratorRole(role, user_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(userKeys.all);
            },
        },
    );
};
