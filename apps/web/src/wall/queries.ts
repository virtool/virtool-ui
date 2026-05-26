import {
	type LoginResult,
	login,
	type ResetPasswordResult,
	resetPassword,
} from "@account/api";
import { accountKeys } from "@account/queries";
import { apiClient } from "@app/api";
import type { Root } from "@app/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ErrorResponse } from "@/types/api";

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
 * Initializes a mutator for sending a login request to the API.
 *
 * @returns A mutator for sending a login request to the API.
 */
export function useLoginMutation() {
	const queryClient = useQueryClient();

	return useMutation<
		LoginResult,
		Error,
		{ handle: string; password: string; remember: boolean }
	>({
		mutationFn: ({ handle, password, remember }) =>
			login({ handle, password, remember }),
		onSuccess: (data) => {
			if (!data.reset) {
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
		ResetPasswordResult,
		Error,
		{ password: string; resetCode: string }
	>({
		mutationFn: ({ password, resetCode }) =>
			resetPassword({ password, resetCode }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}
