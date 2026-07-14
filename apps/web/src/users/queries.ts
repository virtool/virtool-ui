import type { AdministratorRoleName } from "@administration/types";
import { apiClient } from "@app/api";
import {
	createUser,
	findUsers,
	getUser,
	listUsers,
	setAdministratorRole,
	updateUser,
} from "@server/users/functions";
import {
	keepPreviousData,
	queryOptions,
	useInfiniteQuery,
	useMutation,
	useQuery,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { userQueryKeys } from "@users/keys";
import type { UserNested, UserResponse } from "./types";

/**
 * Fetch every active user, for populating selectors and filters
 *
 * @returns A list of users with their ids and handles
 */
export function useListUsers() {
	return useQuery<UserNested[]>({
		queryKey: userQueryKeys.nested(),
		queryFn: () => listUsers(),
	});
}

/**
 * Setup query for fetching user search results for infinite scrolling view
 *
 * @param per_page - The number of users to fetch per page
 * @param term - The search term to filter users by
 * @returns An UseInfiniteQueryResult object containing the user search results
 */
export function useInfiniteFindUsers(per_page: number, term: string) {
	return useInfiniteQuery<UserResponse>({
		queryKey: userQueryKeys.infiniteList([per_page, term]),
		queryFn: ({ pageParam }) =>
			apiClient
				.get("/users")
				.query({ page: pageParam as number, per_page, term })
				.then((res) => res.body),
		initialPageParam: 1,
		getNextPageParam: (lastPage) => {
			if (lastPage.page >= lastPage.page_count) {
				return undefined;
			}
			return (lastPage.page || 1) + 1;
		},
		placeholderData: keepPreviousData,
	});
}

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
