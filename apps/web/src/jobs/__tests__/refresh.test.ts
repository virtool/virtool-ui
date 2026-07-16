import { jobQueryKeys } from "@jobs/keys";
import { createJobRefreshQueue } from "@jobs/refresh";
import type { ServerJob } from "@jobs/types";
import { QueryClient } from "@tanstack/react-query";
import { jobServerFnMocks, mockGetJobs } from "@tests/server-fn/jobs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FLUSH_MS = 500;

function createJob(id: number, overrides?: Partial<ServerJob>): ServerJob {
	return {
		args: {},
		id,
		claim: null,
		claimed_at: null,
		created_at: "2022-12-22T21:37:49.429000Z",
		finished_at: null,
		progress: 50,
		state: "running",
		steps: null,
		user: { id: 7, handle: "bob" },
		workflow: "pathoscope",
		...overrides,
	};
}

describe("createJobRefreshQueue", () => {
	let queryClient: QueryClient;

	beforeEach(() => {
		vi.useFakeTimers();
		queryClient = new QueryClient();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	function watch(...ids: number[]): void {
		for (const id of ids) {
			queryClient.setQueryData(
				jobQueryKeys.detail(id),
				createJob(id, { progress: 0 }),
			);
		}
	}

	it("collapses a wave of frames into a single batched read", async () => {
		mockGetJobs([createJob(1), createJob(2), createJob(3)]);
		watch(1, 2, 3);

		const queue = createJobRefreshQueue(queryClient);
		queue(1);
		queue(2);
		queue(3);
		queue(1);

		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		expect(jobServerFnMocks.getJobs).toHaveBeenCalledExactlyOnceWith({
			data: { jobIds: [1, 2, 3] },
		});
	});

	it("writes each fetched job into its own detail cache", async () => {
		mockGetJobs([
			createJob(1, { progress: 75 }),
			createJob(2, { progress: 90 }),
		]);
		watch(1, 2);

		const queue = createJobRefreshQueue(queryClient);
		queue(1);
		queue(2);

		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		expect(queryClient.getQueryData(jobQueryKeys.detail(1))).toMatchObject({
			progress: 75,
		});
		expect(queryClient.getQueryData(jobQueryKeys.detail(2))).toMatchObject({
			progress: 90,
		});
	});

	// The jobs list page renders its rows from the list query and mounts no
	// detail queries, so this is what stops a frame per row becoming a read per
	// row there.
	it("does not read a job nothing has cached", async () => {
		mockGetJobs([createJob(1)]);

		const queue = createJobRefreshQueue(queryClient);
		queue(1);

		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		expect(jobServerFnMocks.getJobs).not.toHaveBeenCalled();
	});

	it("marks a cached jobs list stale so its counts and ordering catch up", async () => {
		const listKey = jobQueryKeys.list([1, 25]);
		queryClient.setQueryData(listKey, { items: [] });

		const queue = createJobRefreshQueue(queryClient);
		queue(1);

		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		expect(queryClient.getQueryState(listKey)?.isInvalidated).toBe(true);
	});

	it("splits a wave larger than the request cap", async () => {
		const ids = Array.from({ length: 150 }, (_, index) => index + 1);
		mockGetJobs(ids.map((id) => createJob(id)));
		watch(...ids);

		const queue = createJobRefreshQueue(queryClient);
		for (const id of ids) {
			queue(id);
		}

		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		expect(jobServerFnMocks.getJobs).toHaveBeenCalledTimes(2);
		expect(
			jobServerFnMocks.getJobs.mock.calls.map(
				([{ data }]) => data.jobIds.length,
			),
		).toEqual([100, 50]);
	});

	it("falls back to per-job invalidation when the batch fails", async () => {
		jobServerFnMocks.getJobs.mockRejectedValue(new Error("boom"));
		watch(1, 2);

		const queue = createJobRefreshQueue(queryClient);
		queue(1);
		queue(2);

		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		for (const id of [1, 2]) {
			expect(
				queryClient.getQueryState(jobQueryKeys.detail(id))?.isInvalidated,
			).toBe(true);
		}
	});

	it("opens a new window for frames arriving after a flush", async () => {
		mockGetJobs([createJob(1), createJob(2)]);
		watch(1, 2);

		const queue = createJobRefreshQueue(queryClient);

		queue(1);
		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		queue(2);
		await vi.advanceTimersByTimeAsync(FLUSH_MS);

		expect(jobServerFnMocks.getJobs).toHaveBeenCalledTimes(2);
		expect(jobServerFnMocks.getJobs).toHaveBeenNthCalledWith(2, {
			data: { jobIds: [2] },
		});
	});

	it("holds frames arriving inside an open window in the same batch", async () => {
		mockGetJobs([createJob(1), createJob(2)]);
		watch(1, 2);

		const queue = createJobRefreshQueue(queryClient);

		queue(1);
		await vi.advanceTimersByTimeAsync(FLUSH_MS / 2);
		queue(2);
		await vi.advanceTimersByTimeAsync(FLUSH_MS / 2);

		expect(jobServerFnMocks.getJobs).toHaveBeenCalledExactlyOnceWith({
			data: { jobIds: [1, 2] },
		});
	});
});
