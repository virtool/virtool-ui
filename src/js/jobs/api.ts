import { JobSearchResult } from "@jobs/types";
import { forEach } from "lodash-es";
import { Request } from "../app/request";

export const find = ({ archived, states, page }) => {
    const request = Request.get("/jobs").query({ archived, page });
    forEach(states, state => request.query({ state }));
    return request;
};

export const get = ({ jobId }) => Request.get(`/jobs/${jobId}`);
export const cancel = ({ jobId }) => Request.put(`/jobs/${jobId}/cancel`);
export const archive = ({ jobId }) => Request.patch(`/jobs/${jobId}/archive`);

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
