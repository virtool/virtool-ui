import { ErrorResponse } from "@/types/types";
import {
    keepPreviousData,
    useInfiniteQuery,
    useMutation,
} from "@tanstack/react-query";
import { createFirst, findUsers } from "./api";
import { User, UserResponse } from "./types";

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
            findUsers(pageParam as number, per_page, term),
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
 * Initializes a mutator for creating the first instance user
 *
 * @returns A mutator for creating the first instance user
 */
export function useCreateFirstUser() {
    return useMutation<
        User,
        ErrorResponse,
        { handle: string; password: string; forceReset: boolean }
    >({
        mutationFn: ({ handle, password, forceReset }) =>
            createFirst(handle, password, forceReset),
        onSuccess: () => {
            window.location.reload();
        },
    });
}
