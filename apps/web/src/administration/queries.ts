import { apiClient } from "@app/api";
import { createQueryKeys } from "@app/queryKeys";
import { getPasswordPolicyFn } from "@server/settings/functions";
import { listAdministratorRoles } from "@server/users/functions";
import {
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type { Settings } from "./types";

/** Fields that can be changed when updating the server settings */
export type SettingsUpdate = {
	default_source_types?: string[];
	enable_api?: boolean;
	enable_sentry?: boolean;
	minimum_password_length?: number;
	sample_all_read?: boolean;
	sample_all_write?: boolean;
	sample_group?: string;
	sample_group_read?: boolean;
	sample_group_write?: boolean;
};

/** Query keys for the server settings. */
export const settingsQueryKeys = createQueryKeys("settings");

/**
 * Query options for the API settings.
 */
export function settingsQueryOptions() {
	return queryOptions<Settings>({
		queryKey: settingsQueryKeys.all(),
		queryFn: () => apiClient.get("/settings").then((response) => response.body),
	});
}

/** Query keys for the instance password policy. */
export const passwordPolicyQueryKeys = createQueryKeys("passwordPolicy");

/**
 * Query options for the instance password policy.
 *
 * Unlike the settings above, this is readable without a session — the
 * first-user and forced-reset forms need it before one exists.
 */
export function passwordPolicyQueryOptions() {
	return queryOptions({
		queryKey: passwordPolicyQueryKeys.all(),
		queryFn: () => getPasswordPolicyFn(),
	});
}

/**
 * Fetch the API settings.
 *
 * @returns The API settings.
 */
export function useFetchSettings() {
	return useQuery(settingsQueryOptions());
}

/**
 * Fetch the API settings, suspending until they resolve.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary. Use this from components rendered under a route whose loader
 * prefetches the settings.
 */
export function useSuspenseSettings() {
	return useSuspenseQuery(settingsQueryOptions());
}

/**
 * Initializes a mutator for updating the current settings on the server
 *
 * @returns A mutator for updating the current settings on the server
 */
export function useUpdateSettings() {
	const queryClient = useQueryClient();

	return useMutation<Settings, ErrorResponse, SettingsUpdate>({
		mutationFn: (update) =>
			apiClient
				.patch("/settings")
				.send(update)
				.then((response) => response.body),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: settingsQueryKeys.all(),
			});
			// The minimum password length lives in these settings, so the policy the
			// password forms validate against has just gone stale.
			queryClient.invalidateQueries({
				queryKey: passwordPolicyQueryKeys.all(),
			});
		},
	});
}

/** Query keys for administrator roles. */
export const roleQueryKeys = createQueryKeys("roles");

/**
 * Query options for fetching the list of valid administrator roles.
 */
export function administratorRolesQueryOptions() {
	return queryOptions({
		queryKey: roleQueryKeys.all(),
		queryFn: () => listAdministratorRoles(),
	});
}

/**
 * Fetch a list of valid administrator roles from the backend
 *
 * @returns A list of valid administrator roles
 */
export function useGetAdministratorRoles() {
	return useQuery(administratorRolesQueryOptions());
}
