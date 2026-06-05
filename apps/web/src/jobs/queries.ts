import { findJobs, getJob } from "@server/jobs/functions";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	JobSchema,
	JobSearchResultSchema,
	type JobState,
	type ServerJob,
	type ServerJobNested,
} from "./types";

/**
 * Factory object for generating job query keys
 */
export const jobQueryKeys = {
	all: () => ["job"] as const,
	lists: () => ["job", "list"] as const,
	list: (filters: Array<string | number | boolean>) =>
		["job", "list", ...filters] as const,
	details: () => ["job", "details"] as const,
	detail: (jobId: number) => ["job", "details", jobId] as const,
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
		queryFn: () => findJobs({ data: { page, perPage: per_page, states } }),
		placeholderData: keepPreviousData,
		select: JobSearchResultSchema.parse,
	});
}

/**
 * Expand a nested job into a full server-shaped job for seeding the cache.
 *
 * A nested job carried on a parent resource (sample, index, etc.) lacks the
 * args, claim, and steps that `/jobs/:id` returns. Filling them with empty
 * values lets the nested data seed `jobQueryKeys.detail` so the first paint is
 * instant; the SSE-triggered refetch later replaces it with the full job.
 */
function getJobSeed(job: ServerJobNested): ServerJob {
	return {
		...job,
		args: {},
		claim: null,
		claimed_at: null,
		finished_at: null,
		steps: null,
	};
}

/**
 * Fetch a job by its id
 *
 * When a nested job is passed as `seed`, it primes the cache for an instant
 * first paint and pins the entry as fresh, so the network is only hit when an
 * SSE `jobs` update invalidates the query.
 *
 * @param jobId - The id of the job to get
 * @param seed - Nested job data to seed the cache with
 * @returns Query results containing the job
 */
export function useFetchJob(jobId: number, seed?: ServerJobNested) {
	return useQuery({
		queryKey: jobQueryKeys.detail(jobId),
		queryFn: () => getJob({ data: { jobId } }),
		select: JobSchema.parse,
		enabled: Number.isInteger(jobId),
		initialData: seed ? getJobSeed(seed) : undefined,
		staleTime: seed ? Number.POSITIVE_INFINITY : undefined,
	});
}
