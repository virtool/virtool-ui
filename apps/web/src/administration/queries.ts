import { apiClient } from "@app/api";
import {
	createUser,
	findUsers,
	getUser,
	listAdministratorRoles,
	setAdministratorRole,
	updateUser,
} from "@server/users/functions";
import {
	keepPreviousData,
	queryOptions,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import type { ErrorResponse } from "@/types/api";
import type { AdministratorRoleName, Settings } from "./types";

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

/**
 * Factory object for generating user query keys
 */
export const userQueryKeys = {
	all: () => ["users"] as const,
	lists: () => ["users", "list"] as const,
	list: (filters: Array<string | number | boolean | undefined>) =>
		["users", "list", ...filters] as const,
	infiniteLists: () => ["users", "infiniteList"] as const,
	infiniteList: (filters: Array<string | number | boolean | undefined>) =>
		["users", "infiniteList", ...filters] as const,
	details: () => ["users", "details"] as const,
	detail: (user_id: number) => ["users", "details", user_id] as const,
};

/**
 * Query options for a page of user search results.
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - Filter the users by administrator status
 * @param active - Filter the users by whether they are active
 */
export function usersQueryOptions(
	page: number,
	per_page: number,
	term: string,
	administrator?: boolean,
	active?: boolean,
) {
	return queryOptions({
		queryKey: userQueryKeys.list([page, per_page, term, administrator, active]),
		queryFn: () =>
			findUsers({
				data: { page, per_page, term, administrator, active },
			}),
		placeholderData: keepPreviousData,
	});
}

/**
 * Fetch a page of user search results.
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - Filter the users by administrator status
 * @param active - Filter the users by whether they are active
 * @returns A page of user search results
 */
export function useFindUsers(
	page: number,
	per_page: number,
	term: string,
	administrator?: boolean,
	active?: boolean,
) {
	return useQuery(
		usersQueryOptions(page, per_page, term, administrator, active),
	);
}

/**
 * Initializes a mutator for creating a user
 *
 * @returns A mutator for creating a user
 */
export function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation<
		Awaited<ReturnType<typeof createUser>>,
		Error,
		{
			handle: string;
			password: string;
			forceReset: boolean;
		}
	>({
		mutationFn: ({ handle, password, forceReset }) =>
			createUser({ data: { handle, password, forceReset } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
		},
	});
}

/**
 * Query options for a single user.
 *
 * @param userId - The id of the user to fetch
 */
export function userQueryOptions(userId: number) {
	return queryOptions({
		queryKey: userQueryKeys.detail(userId),
		queryFn: () => getUser({ data: { userId } }),
	});
}

/**
 * Fetches a single user
 *
 * @param userId - The id of the user to fetch
 * @returns A single user
 */
export function useFetchUser(userId: number) {
	return useQuery(userQueryOptions(userId));
}

/**
 * Fetches a single user, suspending until it resolves.
 *
 * `data` is always defined, and a failed request throws to the nearest route
 * error boundary. Use this from components rendered under a route whose loader
 * prefetches the user.
 *
 * @param userId - The id of the user to fetch
 */
export function useSuspenseUser(userId: number) {
	return useSuspenseQuery(userQueryOptions(userId));
}

/** Values accepted when updating a user from the administration views. */
export type UserUpdate = {
	active?: boolean;
	force_reset?: boolean;
	handle?: string;
	password?: string;
	groups?: number[];
	primary_group?: number | null;
};

/**
 * Initializes a mutator for updating a user.
 *
 * @returns A mutator for updating a user
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation<
		Awaited<ReturnType<typeof updateUser>>,
		Error,
		{ userId: number; update: UserUpdate }
	>({
		mutationFn: ({ userId, update }) =>
			updateUser({ data: { userId, ...update } }),
		onSuccess: (result) => {
			if (result) {
				queryClient.setQueryData(userQueryKeys.detail(result.id), result);
			}
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
		},
	});
}

/**
 * Set up a query for updating users administrator roles
 *
 * @returns A mutator for updating a users administrator role
 */
export function useSetAdministratorRole() {
	const queryClient = useQueryClient();
	return useMutation<
		Awaited<ReturnType<typeof setAdministratorRole>>,
		Error,
		{ role: AdministratorRoleName | null; user_id: number }
	>({
		mutationFn: ({ role, user_id }) =>
			setAdministratorRole({ data: { userId: user_id, role } }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.all() });
		},
	});
}
