import { jobQueryKeys } from "@jobs/keys";
import * as Sentry from "@sentry/tanstackstart-react";
import { getJobs } from "@server/jobs/functions";
import type { QueryClient } from "@tanstack/react-query";

/**
 * How long to collect job ids before fetching them.
 *
 * A running job emits a frame per step transition, and a page shows one job per
 * row, so frames arrive in waves. Anything long enough to catch a wave collapses
 * it into one request; 500 ms is well under the interval a progress bar is read
 * at.
 */
const FLUSH_MS = 500;

/** Ids per request, matching the cap `getJobs` validates. */
const BATCH_SIZE = 100;

function chunk(ids: number[], size: number): number[][] {
	const chunks: number[][] = [];

	for (let i = 0; i < ids.length; i += size) {
		chunks.push(ids.slice(i, i + size));
	}

	return chunks;
}

/**
 * Build a queue that coalesces `jobs` update frames into batched refreshes.
 *
 * Every on-screen job mounts its own `detail(id)` query, so invalidating each
 * frame's detail fires one request per running job per progress wave. The queue
 * collects the ids instead and reads them in a single `getJobs` call, writing
 * each result straight into its detail cache.
 *
 * The queue holds its own buffer, so callers get one per `QueryClient`.
 */
export function createJobRefreshQueue(
	queryClient: QueryClient,
): (jobId: number) => void {
	const pending = new Set<number>();
	let windowOpen = false;

	async function refreshBatch(jobIds: number[]): Promise<void> {
		try {
			const jobs = await getJobs({ data: { jobIds } });

			for (const job of jobs) {
				queryClient.setQueryData(jobQueryKeys.detail(job.id), job);
			}
		} catch (error) {
			Sentry.captureException(error, { tags: { sse: "job-refresh" } });

			// Fall back to the per-job refetch this batch replaced. It costs the
			// fan-out again, but a failed batch leaving every progress bar frozen
			// is worse than a slow window.
			for (const jobId of jobIds) {
				queryClient.invalidateQueries({ queryKey: jobQueryKeys.detail(jobId) });
			}
		}
	}

	async function flush(): Promise<void> {
		windowOpen = false;

		const ids = [...pending];
		pending.clear();

		// Counts, ordering, and state filters drift as jobs progress, and no
		// amount of detail refetching fixes them. One invalidation per window
		// covers every mounted jobs list, and is a no-op on the pages — samples,
		// analyses, subtractions — that cache no jobs list at all.
		queryClient.invalidateQueries({ queryKey: jobQueryKeys.lists() });

		// A frame for a job nothing has cached has nothing to update. This is what
		// keeps the jobs list page, whose rows render from the list query, from
		// fetching a detail per row.
		const watched = ids.filter(
			(id) => queryClient.getQueryData(jobQueryKeys.detail(id)) !== undefined,
		);

		if (watched.length === 0) {
			return;
		}

		await Promise.all(chunk(watched, BATCH_SIZE).map(refreshBatch));
	}

	return function queueJobRefresh(jobId: number): void {
		pending.add(jobId);

		// The window is never cancelled, only allowed to elapse, so the timer
		// handle is not worth keeping — whether one is pending is the whole state.
		if (windowOpen) {
			return;
		}

		windowOpen = true;

		setTimeout(() => {
			void flush();
		}, FLUSH_MS);
	};
}
