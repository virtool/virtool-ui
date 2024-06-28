import { login } from "@/account/api";
import { ErrorResponse } from "@/types/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Response } from "superagent";

/**
 * Factory object for generating account query keys
 */
export const accountKeys = {
    all: () => ["account"],
    details: () => ["account", "details"] as const,
};

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
