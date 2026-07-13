import { apiClient } from "@app/api";
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
	hmm_slug?: string;
	minimum_password_length?: number;
	sample_all_read?: boolean;
	sample_all_write?: boolean;
	sample_group?: string;
	sample_group_read?: boolean;
	sample_group_write?: boolean;
	sample_unique_names?: boolean;
};

/**
 * Factory object for generating settings query keys
 */
export const settingsQueryKeys = {
	all: () => ["settings"] as const,
};

/**
 * Query options for the API settings.
 */
export function settingsQueryOptions() {
	return queryOptions<Settings>({
		queryKey: settingsQueryKeys.all(),
		queryFn: () => apiClient.get("/settings").then((response) => response.body),
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
		},
	});
}

export const roleQueryKeys = {
	all: () => ["roles"] as const,
};

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
