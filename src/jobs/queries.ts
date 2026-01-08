import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchJob, findJobs } from "./api";
import { Job, JobSearchResult, JobState } from "./types";

/**
 * Factory object for generating job query keys
 */
export const jobQueryKeys = {
    all: () => ["job"] as const,
    lists: () => ["job", "list"] as const,
    list: (filters: Array<string | number | boolean>) =>
        ["job", "list", ...filters] as const,
    details: () => ["job", "details"] as const,
    detail: (jobId: string) => ["job", "details", jobId] as const,
};

/**
 * Fetch a page of job search results from the API
 *
 * @param page - The page to fetch
 * @param per_page - The number of jobs to fetch per page
 * @param states - The states to filter jobs by
 * @returns A page of job search results
 */
export function useFindJobs(
    page: number,
    per_page: number,
    states: JobState[],
) {
    return useQuery({
        queryKey: jobQueryKeys.list([page, per_page, ...states]),
        queryFn: () => findJobs(page, per_page, states),
        placeholderData: keepPreviousData,
        select: JobSearchResult.parse,
    });
}

/**
 * Fetch a job by its id
 *
 * @param jobId - The id of the job to get
 * @returns Query results containing the job
 */
export function useFetchJob(jobId: string) {
    return useQuery({
        queryKey: jobQueryKeys.detail(jobId),
        queryFn: () => fetchJob(jobId),
        select: Job.parse,
    });
}
