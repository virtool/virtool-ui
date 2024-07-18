import { login, resetPassword } from "@/account/api";
import { accountKeys } from "@/account/queries";
import { ErrorResponse } from "@/types/types";
import { Request } from "@app/request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Response } from "superagent";

// Key factory function for the root document
export const rootKeys = {
    all: () => ["root"],
};

/**
 * Initializes a query for fetching the root document.
 *
 * @returns A query for fetching the root document
 */
export function useRootQuery() {
    return useQuery(rootKeys.all(), async () => {
        return Request.get("/");
    });
}

/**
 * Initializes a mutator for sending a login request to the API.
 *
 * @returns A mutator for sending a login request to the API.
 */
export function useLoginMutation() {
    const queryClient = useQueryClient();

    return useMutation<Response, ErrorResponse, { username: string; password: string; remember: boolean }>(
        ({ username, password, remember }) => login({ username, password, remember }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(accountKeys.all());
            },
        },
    );
}

/**
 * Initializes a mutator for sending a password reset request to the API.
 *
 * @returns A mutator for sending a password reset request to the API.
 */
export function useResetPasswordMutation() {
    const queryClient = useQueryClient();

    return useMutation<Response, ErrorResponse, { password: string; resetCode: string }>(
        ({ password, resetCode }) => resetPassword({ password, resetCode }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(accountKeys.all());
            },
        },
    );
}
