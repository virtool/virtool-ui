import { ErrorResponse } from "@/types/types";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { NewUser, User } from "../users/types";
import { createFirst, findUsers } from "./api";
import { UserResponse } from "./types";

/**
 * Factory object for generating user query keys
 */
export const userQueryKeys = {
    all: () => ["users"] as const,
    lists: () => ["users", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["users", "list", ...filters] as const,
    infiniteLists: () => ["users", "list", "infinite"] as const,
    infiniteList: (filters: Array<string | number | boolean>) => ["users", "list", "infinite", ...filters] as const,
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
    return useInfiniteQuery<UserResponse>(
        userQueryKeys.infiniteList([per_page, term]),
        ({ pageParam }) => findUsers(pageParam, per_page, term),
        {
            getNextPageParam: lastPage => {
                if (lastPage.page >= lastPage.page_count) {
                    return undefined;
                }
                return (lastPage.page || 1) + 1;
            },
            keepPreviousData: true,
        },
    );
}

export function useCreateFirstUser() {
    return useMutation<User, ErrorResponse, NewUser>(createFirst, {
        onSuccess: () => {
            window.location.reload();
        },
    });
}
