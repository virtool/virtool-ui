import { timeoutStalledJobs } from "@virtool/data/jobs/data";
import { z } from "zod";
import { defineTask } from "../framework/define";
import type { TaskContext } from "./registry";

/**
 * `timeout_jobs` is spawned on a schedule and carries nothing.
 */
const payload = z.object({});

/**
 * Fail every running job whose runner has stopped pinging.
 *
 * The port of Python's `JobsTimeoutTask`, whose body is likewise one call.
 * Everything it runs is `timeoutStalledJobs`, which fails the stale rows in a
 * single conditional statement and publishes a `jobs` frame for each.
 *
 * It is idempotent as a reclaim requires: the statement's predicate matches
 * only rows still running and still stale, so a re-run from step zero is a
 * no-op against a sweep that already committed.
 *
 * It reports no progress inside the step. The sweep is one round trip and the
 * count is not known until it returns, so there is no position worth publishing
 * and the bar moves 0 → 100 on the framework's step entry and completion writes
 * alone.
 *
 * The run's signal is not forwarded, because nothing here waits on anything a
 * caller could abandon. A drain arriving mid-sweep lets the statement and its
 * frames finish, which is what should happen — those jobs are failed, and a
 * frame withheld is a job page left showing a job as running.
 */
export const timeoutJobsTask = defineTask<typeof payload, TaskContext>({
	type: "timeout_jobs",
	payload,
	// Python's step is the bound method `timeout_jobs`, which `BaseTask.run`
	// writes to the column as `func.__name__`. Both runners write the same name
	// for the same work until the cutover completes.
	steps: ["timeout_jobs"],
	async run({ ctx, helpers, logger }) {
		await helpers.runStep("timeout_jobs", async () => {
			const timedOut = await timeoutStalledJobs(ctx.db);

			if (timedOut.length > 0) {
				logger.info({ count: timedOut.length }, "timed out stalled jobs");
			}
		});
	},
});
