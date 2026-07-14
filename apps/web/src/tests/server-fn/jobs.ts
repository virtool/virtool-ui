import type { ServerJob, ServerJobMinimal } from "@jobs/types";
import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/jobs/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test importing this helper can stub
 * the jobs server functions without per-file `vi.mock` boilerplate.
 */
export const jobServerFnMocks = {
	findJobs: vi.fn(),
	getJob: vi.fn(),
};

/** Sets up findJobs to resolve with a single page containing the given jobs. */
export function mockFindJobs(
	jobs: ServerJobMinimal[],
	found_count?: number,
): Mock {
	jobServerFnMocks.findJobs.mockResolvedValue({
		counts: {},
		found_count: found_count ?? jobs.length,
		items: jobs,
		page: 1,
		page_count: 1,
		per_page: 25,
		total_count: jobs.length,
	});
	return jobServerFnMocks.findJobs;
}

/** Sets up getJob to resolve with the given job when matched by id. */
export function mockGetJob(jobId: number, job: ServerJob): Mock {
	jobServerFnMocks.getJob.mockImplementation(
		async ({ data }: { data: { jobId: number } }) => {
			if (data.jobId === jobId) {
				return job;
			}
			throw new Error(`unexpected jobId in mockGetJob: ${data.jobId}`);
		},
	);
	return jobServerFnMocks.getJob;
}
