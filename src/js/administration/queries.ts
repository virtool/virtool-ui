import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, UserResponse } from "@users/types";
import {
    fetchAdministratorRoles,
    fetchSettings,
    findUsers,
    getUser,
    setAdministratorRole,
    updateSettings,
    updateUser,
    UserUpdate,
} from "./api";
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

/**
 * Initializes a mutator for updating the current settings on the server
 *
 * @returns A mutator for updating the current settings on the server
 */
export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation(updateSettings, {
        onSuccess: () => {
            queryClient.invalidateQueries(settingsQueryKeys.all());
        },
    });
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
 * @param active - Filter the users by whether they are active
 * @returns A page of user search results
 */
export function useFindUsers(page: number, per_page: number, term: string, administrator?: boolean, active?: boolean) {
    return useQuery<UserResponse>(
        userQueryKeys.list([page, per_page, term, administrator, active]),
        () => findUsers(page, per_page, term, administrator, active),
        {
            keepPreviousData: true,
        }
    );
}

/**
 * Fetches a single user
 *
 * @param userId - The id of the user to fetch
 * @returns A single user
 */
export function useFetchUser(userId: string) {
    return useQuery<User>(userQueryKeys.detail(userId), () => getUser(userId));
}

/**
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation<User, unknown, { userId: string; update: UserUpdate }>(
        ({ userId, update }) => updateUser(userId, update),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(userQueryKeys.details());
            },
        }
    );
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
        }
    );
};
