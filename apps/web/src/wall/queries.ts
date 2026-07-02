import { accountKeys } from "@account/queries";
import { apiClient } from "@app/api";
import type { Root } from "@app/types";
import {
	createFirstUserFn,
	loginFn,
	resetPasswordFn,
} from "@server/auth/functions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ErrorResponse } from "@/types/api";

/** Result of a login attempt. `reset_code` is only set when `reset` is true. */
export type LoginResult = {
	reset: boolean;
	reset_code?: string;
};

/** Result of a successful password reset. */
export type ResetPasswordResult = {
	login: false;
	reset: false;
};

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
 * Initializes a mutator for creating the first instance user.
 *
 * The new user is authenticated by the server function, so on success the
 * cached root and account documents are dropped. That forces the authenticated
 * route guard to refetch them instead of reusing the pre-setup snapshot, which
 * would otherwise redirect straight back to `/setup`.
 *
 * @returns A mutator for creating the first instance user.
 */
export function useCreateFirstUser() {
	const queryClient = useQueryClient();

	return useMutation<
		Awaited<ReturnType<typeof createFirstUserFn>>,
		Error,
		{ handle: string; password: string }
	>({
		mutationFn: ({ handle, password }) =>
			createFirstUserFn({ data: { handle, password } }),
		onSuccess: () => {
			queryClient.removeQueries({ queryKey: rootKeys.all() });
			queryClient.removeQueries({ queryKey: accountKeys.all() });
		},
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
			loginFn({ data: { handle, password, remember } }),
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
			resetPasswordFn({ data: { password, reset_code: resetCode } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}
