import { apiClient } from "@app/api";
import { listUsers } from "@server/users/functions";
import {
	keepPreviousData,
	useInfiniteQuery,
	useQuery,
} from "@tanstack/react-query";
import type { UserNested, UserResponse } from "./types";

/**
 * Factory object for generating user query keys
 */
export const userQueryKeys = {
	all: () => ["users"] as const,
	lists: () => ["users", "list"] as const,
	list: (filters: Array<string | number | boolean>) =>
		["users", "list", ...filters] as const,
	infiniteLists: () => ["users", "list", "infinite"] as const,
	infiniteList: (filters: Array<string | number | boolean>) =>
		["users", "list", "infinite", ...filters] as const,
	details: () => ["users", "details"] as const,
	detail: (user_id: string) => ["users", "details", user_id] as const,
};

/**
 * Fetch every active user, for populating selectors and filters
 *
 * @returns A list of users with their ids and handles
 */
export function useListUsers() {
	return useQuery<UserNested[]>({
		queryKey: userQueryKeys.list([]),
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
