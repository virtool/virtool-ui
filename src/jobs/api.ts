import { apiClient } from "@app/api";
import {
    JobMinimal,
    JobSearchResult,
    JobState,
    jobStateToLegacy,
} from "./types";

/**
 * Convert new job states to legacy states for API queries.
 */
function convertToLegacyJobStates(states: JobState[]): string[] {
    return states.flatMap((state) => jobStateToLegacy[state]);
}

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
): Promise<JobSearchResult> {
    const response = await apiClient
        .get("/jobs")
        .query({ page, per_page, state: convertToLegacyJobStates(states) });

    return {
        ...response.body,
        documents: response.body.documents.map(JobMinimal.parse),
    };
}

/**
 * Fetches a single job
 *
 * @param jobId - The id of the job to fetch
 * @returns A promise resolving to a single job
 */
export async function fetchJob(jobId: string): Promise<unknown> {
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.body;
}
