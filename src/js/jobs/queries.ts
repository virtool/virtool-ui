import { findJobs, getJob } from "@jobs/api";
import { Job, JobSearchResult } from "@jobs/types";
import { keepPreviousData, useInfiniteQuery, useQuery } from "@tanstack/react-query";

/**
 * Factory object for generating job query keys
 */
export const jobQueryKeys = {
    all: () => ["job"] as const,
    lists: () => ["job", "list"] as const,
    list: (filters: Array<string | number | boolean>) => ["job", "list", ...filters] as const,
    infiniteList: (filters: Array<string[] | string | number>) => ["job", "list", "infinite", ...filters] as const,
    details: () => ["job", "details"] as const,
    detail: (jobId: string) => ["job", "details", jobId] as const,
};

/**
 * Fetch a page of job search results from the API
 *
 * @param states - The states to filter jobs by
 * @returns A page of job search results
 */
export function useInfiniteFindJobs(states: string[]) {
    return useInfiniteQuery<JobSearchResult>({
        queryKey: jobQueryKeys.infiniteList([states]),
        queryFn: ({ pageParam }) => findJobs(pageParam as number, states),
        initialPageParam: 0,
        getNextPageParam: lastPage => {
            if (lastPage.page >= lastPage.page_count) {
                return undefined;
            }
            return (lastPage.page || 1) + 1;
        },
        placeholderData: keepPreviousData,
    });
}

/**
 * Fetch a job by its id
 *
 * @param jobId - The id of the job to get
 * @returns Query results containing the job
 */
export function useFetchJob(jobId: string) {
    return useQuery<Job>({ queryKey: jobQueryKeys.detail(jobId), queryFn: () => getJob(jobId) });
}
