import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { changePassword, fetchAccount, updateAccount } from "./api";
import { Account } from "./types";

/**
 * Factory object for generating account query keys
 */
export const accountKeys = {
    all: () => ["account"],
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
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useUpdateAccount() {
    const queryClient = useQueryClient();

    return useMutation<unknown, unknown, { update: any }>(({ update }) => updateAccount(update), {
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

    return useMutation<unknown, unknown, { old_password: string; password: string }>(
        ({ old_password, password }) => changePassword(old_password, password),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(accountKeys.all());
            },
        },
    );
}
