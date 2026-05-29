import { apiClient } from "@app/api";
import {
	keepPreviousData,
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { AdminUserResponse, User } from "@users/types";
import type { ErrorResponse } from "@/types/api";
import type {
	AdministratorRole,
	AdministratorRoleName,
	Settings,
} from "./types";

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

/** Fields that can be changed when updating a user */
export type UserUpdate = {
	active?: boolean;
	force_reset?: boolean;
	password?: string;
	primary_group?: string;
	groups?: Array<string | number>;
};

/**
 * Factory object for generating settings query keys
 */
export const settingsQueryKeys = {
	all: () => ["settings"] as const,
};

/**
 * Fetch the API settings.
 *
 * @returns The API settings.
 */
export function useFetchSettings() {
	return useQuery<Settings>({
		queryKey: settingsQueryKeys.all(),
		queryFn: () => apiClient.get("/settings").then((response) => response.body),
	});
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
 * Fetch a list of valid administrator roles from the backend
 *
 * @returns A list of valid administrator roles
 */
export function useGetAdministratorRoles() {
	return useQuery<AdministratorRole[]>({
		queryKey: roleQueryKeys.all(),
		queryFn: () => apiClient.get("/admin/roles").then((res) => res.body),
	});
}

/**
 * Factory object for generating user query keys
 */
export const userQueryKeys = {
	all: () => ["users"] as const,
	lists: () => ["users", "list"] as const,
	list: (filters: Array<string | number | boolean>) =>
		["users", "list", ...filters] as const,
	infiniteLists: () => ["users", "infiniteList"] as const,
	infiniteList: (filters: Array<string | number | boolean>) =>
		["users", "infiniteList", ...filters] as const,
	details: () => ["users", "details"] as const,
	detail: (user_id: number) => ["users", "details", user_id] as const,
};

/**
 * Fetch a page of user search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @param administrator - filter the users by administrator status
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
	return useQuery<AdminUserResponse>({
		queryKey: userQueryKeys.list([page, per_page, term, administrator, active]),
		queryFn: () =>
			apiClient
				.get("/admin/users")
				.query({ page, per_page, term, administrator, active })
				.then((response) => response.body),
		placeholderData: keepPreviousData,
	});
}

/**
 * Initializes a mutator for creating a user
 *
 * @returns A mutator for creating a user
 */
export function useCreateUser() {
	const queryClient = useQueryClient();
	return useMutation<
		User,
		ErrorResponse,
		{
			handle: string;
			password: string;
			forceReset: boolean;
		}
	>({
		mutationFn: ({ handle, password, forceReset }) =>
			apiClient
				.post("/admin/users")
				.send({ handle, password, force_reset: forceReset })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
		},
	});
}

/**
 * Fetches a single user
 *
 * @param userId - The id of the user to fetch
 * @returns A single user
 */
export function useFetchUser(userId: number) {
	return useQuery<User>({
		queryKey: userQueryKeys.detail(userId),
		queryFn: () =>
			apiClient.get(`/admin/users/${userId}`).then((res) => res.body),
	});
}

/**
 * Initializes a mutator for updating a user.
 *
 * @returns A mutator for updating a user
 */
export function useUpdateUser() {
	const queryClient = useQueryClient();
	return useMutation<User, unknown, { userId: number; update: UserUpdate }>({
		mutationFn: ({ userId, update }) =>
			apiClient
				.patch(`/admin/users/${userId}`)
				.send(update)
				.then((res) => res.body),
		onSuccess: (result) =>
			queryClient.setQueryData(userQueryKeys.detail(result.id), result),
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
		User,
		ErrorResponse,
		{ role: AdministratorRoleName; user_id: number }
	>({
		mutationFn: ({ role, user_id }) =>
			apiClient
				.put(`/admin/users/${user_id}/role`)
				.send({ role })
				.then((res) => res.body),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: userQueryKeys.all() });
		},
	});
}
