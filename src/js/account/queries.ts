import { ErrorResponse } from "@/types/types";
import { Permissions } from "@groups/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@users/types";
import {
    AccountUpdate,
    changePassword,
    createAPIKey,
    fetchAccount,
    getAPIKeys,
    removeAPIKey,
    updateAccount,
    updateAPIKey,
} from "./api";
import { Account, APIKeyMinimal } from "./types";

/**
 * Factory object for generating account query keys
 */
export const accountKeys = {
    all: () => ["account"],
    details: () => ["account", "details"] as const,
};

/**
 * Fetches account data for the logged-in user
 *
 * @returns UseQueryResult object containing the account data
 */
export function useFetchAccount() {
    return useQuery<Account>(accountKeys.all(), () => fetchAccount());
}

/**
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation<User, ErrorResponse, { update: AccountUpdate }>(({ update }) => updateAccount(update), {
        onSuccess: () => {
            queryClient.invalidateQueries(accountKeys.all());
        },
    });
}

/**
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useChangePassword() {
    const queryClient = useQueryClient();

    return useMutation<User, ErrorResponse, { old_password: string; password: string }>(
        ({ old_password, password }) => changePassword(old_password, password),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(accountKeys.all());
            },
        },
    );
}

/**
 * Fetches the API keys for the current user
 *
 * @returns A list of API keys for the current user
 */
export function useFetchAPIKeys() {
    return useQuery<APIKeyMinimal[]>(accountKeys.details(), () => getAPIKeys());
}

/**
 * Initializes a mutator for creating a new API key
 *
 * @returns A mutator for creating a new API key
 */
export function useCreateAPIKey() {
    return useMutation<APIKeyMinimal, ErrorResponse, { name: string; permissions: Permissions }>(
        ({ name, permissions }) => createAPIKey(name, permissions),
    );
}

/**
 * Initializes a mutator for updating an API key
 *
 * @returns A mutator for updating an API key
 */
export function useUpdateAPIKey() {
    const queryClient = useQueryClient();

    return useMutation<APIKeyMinimal, ErrorResponse, { keyId: string; permissions: Permissions }>(
        ({ keyId, permissions }) => updateAPIKey(keyId, permissions),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(accountKeys.all());
            },
        },
    );
}

/**
 * Initializes a mutator for removing an API key
 *
 * @returns A mutator for removing an API key
 */
export function useRemoveAPIKey() {
    const queryClient = useQueryClient();

    return useMutation<null, ErrorResponse, { keyId: string }>(({ keyId }) => removeAPIKey(keyId), {
        onSuccess: () => {
            queryClient.invalidateQueries(accountKeys.all());
        },
    });
}
