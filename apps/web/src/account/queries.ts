import type { Account, APIKeyMinimal } from "@account/types";
import { apiClient } from "@app/api";
import { resetClient } from "@app/utils";
import type { Permissions } from "@groups/types";
import * as Sentry from "@sentry/tanstackstart-react";
import { logoutFn } from "@server/auth/functions";
import { updateAccountHandle } from "@server/users/functions";
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { User } from "@users/types";
import type { ErrorResponse } from "@/types/api";

/** Fields that can be changed when updating the current account */
export type AccountUpdate = {
	email?: string;
};

/**
 * Factory object for generating account query keys
 */
export const accountKeys = {
	all: () => ["account"],
	details: () => ["account", "details"] as const,
};

/**
 * Query options for fetching the logged-in user's account data.
 *
 * Shared by the account hook and the route loaders that gate authenticated
 * pages on a resolved account.
 */
export function accountQueryOptions() {
	return queryOptions<Account, ErrorResponse>({
		queryKey: accountKeys.all(),
		queryFn: () => apiClient.get("/account").then((response) => response.body),
	});
}

/**
 * Fetches account data for the logged-in user
 *
 * @returns UseQueryResult object containing the account data
 */
export function useFetchAccount() {
	return useQuery(accountQueryOptions());
}

/**
 * Initializes a mutator for updating a user
 *
 * @returns A mutator for updating a user
 */
export function useUpdateAccount() {
	const queryClient = useQueryClient();

	return useMutation<User, ErrorResponse, { update: AccountUpdate }>({
		mutationFn: ({ update }) =>
			apiClient
				.patch("/account")
				.send({ update })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}

/**
 * Initializes a mutator for changing the current account's handle
 *
 * @returns A mutator for changing the account handle
 */
export function useUpdateHandle() {
	const queryClient = useQueryClient();

	return useMutation<
		Awaited<ReturnType<typeof updateAccountHandle>>,
		Error,
		{ handle: string }
	>({
		mutationFn: ({ handle }) => updateAccountHandle({ data: { handle } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
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

	return useMutation<
		User,
		ErrorResponse,
		{ old_password: string; password: string }
	>({
		mutationFn: ({ old_password, password }) =>
			apiClient
				.patch("/account")
				.send({ old_password, password })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}

/**
 * Fetches the API keys for the current user
 *
 * @returns A list of API keys for the current user
 */
export function useFetchAPIKeys() {
	return useQuery<APIKeyMinimal[]>({
		queryKey: accountKeys.details(),
		queryFn: () => apiClient.get("/account/keys").then((res) => res.body),
	});
}

/**
 * Initializes a mutator for creating a new API key
 *
 * @returns A mutator for creating a new API key
 */
export function useCreateAPIKey() {
	const queryClient = useQueryClient();

	return useMutation<
		APIKeyMinimal,
		ErrorResponse,
		{ name: string; permissions: Permissions }
	>({
		mutationFn: ({ name, permissions }) =>
			apiClient
				.post("/account/keys")
				.send({ name, permissions })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}

/**
 * Initializes a mutator for updating an API key
 *
 * @returns A mutator for updating an API key
 */
export function useUpdateApiKey() {
	const queryClient = useQueryClient();

	return useMutation<
		APIKeyMinimal,
		ErrorResponse,
		{ keyId: string; permissions: Permissions }
	>({
		mutationFn: ({ keyId, permissions }) =>
			apiClient
				.patch(`/account/keys/${keyId}`)
				.send({ permissions })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}

/**
 * Initializes a mutator for removing an API key
 *
 * @returns A mutator for removing an API key
 */
export function useRemoveAPIKey() {
	const queryClient = useQueryClient();

	return useMutation<null, ErrorResponse, { keyId: string }>({
		mutationFn: ({ keyId }) =>
			apiClient.delete(`/account/keys/${keyId}`).then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: accountKeys.all() });
		},
	});
}

/**
 * Initializes a mutator for logging out a user
 *
 * @returns A mutator for logging out a user
 */
export function useLogout() {
	return useMutation<null, ErrorResponse>({
		mutationFn: () => logoutFn(),
		onSuccess: () => {
			Sentry.setUser(null);
			resetClient();
		},
	});
}
