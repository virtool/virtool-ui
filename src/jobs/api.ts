import { apiClient } from "@app/api";
import { JobState, ServerJob, ServerJobSearchResult } from "./types";

/**
 * Fetch a page of job search results
 *
 * @param page - The page to fetch
 * @param per_page - The number of jobs to fetch per page
 * @param states - The states to filter the jobs by
 * @returns A promise resolving to a page of job search results
 */
export async function findJobs(
    page: number,
    per_page: number,
    states: JobState[],
): Promise<ServerJobSearchResult> {
    const response = await apiClient
        .get("/jobs/v2")
        .query({ page, per_page, state: states });

    return response.body;
}

/**
 * Fetches a single job
 *
 * @param jobId - The id of the job to fetch
 * @returns A promise resolving to a single job
 */
export async function fetchJob(jobId: string): Promise<ServerJob> {
    const response = await apiClient.get(`/jobs/v2/${jobId}`);
    return response.body;
}
