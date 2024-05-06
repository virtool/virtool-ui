import { ErrorResponse } from "@/types/types";
import { Permissions } from "@groups/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { APIKeysResponse, createAPIKey, CreateAPIKeyResponse, fetchAccount, getAPIKeys } from "./api";
import { Account } from "./types";

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
export const useFetchAccount = () => {
    return useQuery<Account>(accountKeys.all(), () => fetchAccount());
};

/**
 * Fetches the API keys for the logged-in user
 *
 * @returns
 */
export function useFetchAPIKeys() {
    return useQuery<APIKeysResponse[]>(accountKeys.details(), () => getAPIKeys());
}

/**
 * Initializes a mutator for creating a new API key for the current account
 *
 * @returns A mutator for creating a new API key for the current account
 */
export function useCreateAPIKey() {
    return useMutation<CreateAPIKeyResponse, ErrorResponse, { name: string; permissions: Permissions }>(
        ({ name, permissions }) => createAPIKey(name, permissions),
    );
}
