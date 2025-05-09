import { fetchAccount, login, resetPassword } from "@account/api";
import { accountKeys } from "@account/queries";
import { Account } from "@account/types";
import { apiClient } from "@app/api";
import { Root } from "@app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Response } from "superagent";

import { ErrorResponse } from "@/types/api";

/** Key factory function for the root document */
export const rootKeys = {
    all: () => ["root"],
};

/**
 * Initializes a query for fetching the root document.
 *
 * @returns A query for fetching the root document
 */
export function useRootQuery() {
    return useQuery<Root, ErrorResponse>({
        queryKey: rootKeys.all(),
        queryFn: () => apiClient.get("/").then((res) => res.body),
    });
}

/**
 * Initializes a query for fetching the account document.
 *
 * @returns A query for fetching the account document
 */
export function useAuthentication() {
    const queryClient = useQueryClient();

    const { data, isPending, isError, error, refetch, ...queryInfo } = useQuery<
        Account,
        ErrorResponse
    >({
        queryKey: accountKeys.all(),
        queryFn: fetchAccount,
        retry: false,
        refetchOnWindowFocus: false,
    });

    if (isError) {
        if (error.response?.status === 401) {
            queryClient.setQueryData(accountKeys.all(), null);
        }
    }

    const authenticated = Boolean(data);

    return { authenticated, isPending, isError, refetch, ...queryInfo };
}

/**
 * Initializes a mutator for sending a login request to the API.
 *
 * @returns A mutator for sending a login request to the API.
 */
export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        Response,
        ErrorResponse,
        { username: string; password: string; remember: boolean }
    >({
        mutationFn: ({ username, password, remember }) =>
            login({ username, password, remember }),
        onSuccess: (data) => {
            if (!data.body.reset) {
                queryClient.invalidateQueries({ queryKey: accountKeys.all() });
            }
        },
    });
}

/**
 * Initializes a mutator for sending a password reset request to the API.
 *
 * @returns A mutator for sending a password reset request to the API.
 */
export function useResetPasswordMutation() {
    const queryClient = useQueryClient();

    return useMutation<
        Response,
        ErrorResponse,
        { password: string; resetCode: string }
    >({
        mutationFn: ({ password, resetCode }) =>
            resetPassword({ password, resetCode }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: accountKeys.all() });
        },
    });
}
