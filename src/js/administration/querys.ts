import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "react-query";
import { UserResponse } from "../users/types";
import { fetchAdministratorRoles, fetchSettings, findUsers, setAdministratorRole } from "./api";
import { AdministratorRole, AdministratorRoles } from "./types";

/**
 * Factory object for generating settings query keys
 */
export const settingsKeys = {
    all: () => ["settings"] as const,
};

/**
 * Fetch the API settings.
 *
 * @returns The API settings.
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
 * @returns A list of valid administrator roles
 */
export const useGetAdministratorRoles = () => {
    return useQuery<AdministratorRole[]>(roleKeys.all(), fetchAdministratorRoles);
};

/**
 * Factory object for generating user query keys
 */
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
        userKeys.list([page, per_page, term, administrator]),
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
                queryClient.invalidateQueries(userKeys.all);
            },
        },
    );
};
