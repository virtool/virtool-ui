import { apiClient } from "@app/api";
import type { JobState, ServerJob, ServerJobSearchResult } from "./types";

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
		.get("/jobs")
		.query({ page, per_page, state: states });

	return response.body;
}

/**
 * Fetches a single job
 *
 * @param jobId - The id of the job to fetch
 * @returns A promise resolving to a single job
 */
export async function fetchJob(jobId: number): Promise<ServerJob> {
	const response = await apiClient.get(`/jobs/${jobId}`);
	return response.body;
}
