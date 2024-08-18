import { ErrorResponse } from "@/types/types";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User, UserResponse } from "@users/types";
import { useHistory } from "react-router-dom";
import {
    createUser,
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
    return useQuery<Settings>({ queryKey: settingsQueryKeys.all(), queryFn: fetchSettings });
}

/**
 * Initializes a mutator for updating the current settings on the server
 *
 * @returns A mutator for updating the current settings on the server
 */
export function useUpdateSettings() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSettings,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all() });
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
export function useGetAdministratorRoles() {
    return useQuery<AdministratorRoles[]>({ queryKey: roleQueryKeys.all(), queryFn: fetchAdministratorRoles });
}

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
    return useQuery<UserResponse>({
        queryKey: userQueryKeys.list([page, per_page, term, administrator, active]),
        queryFn: () => findUsers(page, per_page, term, administrator, active),
        placeholderData: keepPreviousData,
    });
}

/**
 * Initializes a mutator for creating a user
 *
 * @returns A mutator for creating a user
 */
export function useCreateUser() {
    const history = useHistory();

    return useMutation<
        User,
        ErrorResponse,
        {
            handle: string;
            password: string;
            forceReset: boolean;
        }
    >({
        mutationFn: createUser,
        onSuccess: () => {
            history.push({ state: { createUser: false } });
        },
    });
}

/**
 * Fetches a single user
 *
 * @param userId - The id of the user to fetch
 * @returns A single user
 */
export function useFetchUser(userId: string) {
    return useQuery<User>({ queryKey: userQueryKeys.detail(userId), queryFn: () => getUser(userId) });
}

/**
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useUpdateUser() {
    const queryClient = useQueryClient();
    return useMutation<User, unknown, { userId: string; update: UserUpdate }>({
        mutationFn: ({ userId, update }) => updateUser(userId, update),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.details() });
        },
    });
}

/**
 * Set up a query for updating users administrator roles
 *
 * @returns A mutator for updating a users administrator role
 */
export function useSetAdministratorRole() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ role, user_id }: { role: AdministratorRoles; user_id: string }) =>
            setAdministratorRole(role, user_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userQueryKeys.all() });
        },
    });
}
