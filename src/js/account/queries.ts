import { ErrorResponse } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "@users/types";
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

    return useMutation<User, ErrorResponse, { update: string }>(({ update }) => updateAccount(update), {
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
