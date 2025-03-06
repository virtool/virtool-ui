import { apiClient } from "@app/apiClient";
import { Job, JobSearchResult } from "@jobs/types";

/**
 * Fetch a page of job search results
 *
 * @param page - The page to fetch
 * @param per_page - The number of jobs to fetch per page
 * @param states - The states to filter the jobs by
 * @returns A promise resolving to a page of job search results
 */
export function findJobs(
    page: number,
    per_page: number,
    states: string[],
): Promise<JobSearchResult> {
    return apiClient
        .get("/jobs")
        .query({ page, per_page, state: states })
        .then((res) => res.body);
}

/**
 * Fetches a single job
 *
 * @param jobId - The id of the job to fetch
 * @returns A promise resolving to a single job
 */
export function getJob(jobId: string): Promise<Job> {
    return apiClient.get(`/jobs/${jobId}`).then((res) => res.body);
}
