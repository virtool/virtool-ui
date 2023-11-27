import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { User, UserResponse } from "../users/types";
import { fetchAdministratorRoles, fetchSettings, findUsers, getUser, setAdministratorRole, updateUser } from "./api";
import { AdministratorRoles, Settings } from "./types";

/**
 * Factory object for generating settings query keys
 */
export const settingsQueryKeys = {
    all: () => ["settings"] as const,
};

/**
 * Fetch the API settings.
 *
 * @returns The API settings.
 */
export function useFetchSettings() {
    return useQuery<Settings>(settingsQueryKeys.all(), fetchSettings);
}

export const roleQueryKeys = {
    all: () => ["roles"] as const,
};

/**
 * Fetch a list of valid administrator roles from the backend
 *
 * @returns A list of valid administrator roles
 */
export const useGetAdministratorRoles = () => {
    return useQuery<AdministratorRoles[]>(roleQueryKeys.all(), fetchAdministratorRoles);
};

/**
 * Factory object for generating user query keys
 */
export const userQueryKeys = {
    all: () => ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["users", "list", ...filters] as const,
    infiniteLists: () => ["users", "infiniteList"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["users", "infiniteList", ...filters] as const,
    details: () => ["users", "details"] as const,
    detail: (user_id: string) => ["users", "details", user_id] as const,
};

/**
 * Fetch a page of user search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - filter the users by administrator status
 * @returns A page of user search results
 */
export const useFindUsers = (page: number, per_page: number, term: string, administrator?: boolean) => {
    return useQuery<UserResponse>(
        userQueryKeys.list([page, per_page, term, administrator]),
        () => findUsers(page, per_page, term, administrator),
        {
            keepPreviousData: true,
        },
    );
};

/**
 * Setup query for fetching user search results for infinite scrolling view
 *
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - filter the users by administrator status
 * @returns An UseInfiniteQueryResult object containing the user search results
 */
export const useInfiniteFindUsers = (per_page: number, term: string, administrator?: boolean) => {
    return useInfiniteQuery<UserResponse>(
        userQueryKeys.infiniteList([per_page, term, administrator]),
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
 * Fetches a single user
 *
 * @param userId - The id of the user to fetch
 * @returns A single user
 */
export function useGetUser(userId: string) {
    return useQuery<User>(userQueryKeys.detail(userId), () => getUser(userId));
}

/**
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation(updateUser, {
        onSuccess: () => {
            queryClient.invalidateQueries(userQueryKeys.details());
        },
    });
}

/**
 * Set up a query for updating users administrator roles
 *
 * @returns A mutator for updating a users administrator role
 */
export const useSetAdministratorRole = () => {
    const queryClient = useQueryClient();
    return useMutation(
        ({ role, user_id }: { role: AdministratorRoles; user_id: string }) => setAdministratorRole(role, user_id),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(userQueryKeys.all());
            },
        },
    );
};
