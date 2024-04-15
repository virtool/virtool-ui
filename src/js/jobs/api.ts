import { Job, JobSearchResult } from "@jobs/types";
import { Request } from "../app/request";

export const get = ({ jobId }) => Request.get(`/jobs/${jobId}`);

/**
 * Fetch a page of job search results
 *
 * @param page - The page to fetch
 * @param states - The states to filter the jobs by
 * @returns A promise resolving to a page of job search results
 */
export function findJobs(page: number, states: string[]): Promise<JobSearchResult> {
    return Request.get("/jobs")
        .query({ page, state: states })
        .then(res => res.body);
}

/**
 * Fetches a single job
 *
 * @param jobId - The id of the job to fetch
 * @returns A promise resolving to a single job
 */
export function getJob(jobId: string): Promise<Job> {
    return Request.get(`/jobs/${jobId}`).then(res => res.body);
}
