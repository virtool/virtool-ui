import { fetchAndUpdateRelease } from "@virtool/data/hmm/data";
import { z } from "zod";
import { defineTask } from "../framework/define";
import type { TaskContext } from "./registry";

/**
 * `refresh_hmms` is spawned on a schedule and carries nothing.
 *
 * Non-strict, so a row Python wrote with a key this side does not read still
 * runs. A strict schema would fail the task on the extra key instead, and the
 * body reads no key at all.
 */
const payload = z.object({});

/**
 * Refresh the stored HMM release from the www.virtool.ca manifest.
 *
 * The port of Python's `HMMRefreshTask`, and the first task body written
 * against this framework. One step, one call, no branching — every decision it
 * makes visible is a framework decision rather than a domain one.
 *
 * It is idempotent by construction, which is what a reclaim requires: the step
 * reads the manifest and overwrites the status singleton, so running it twice
 * leaves what running it once leaves.
 *
 * It reports no progress inside the step. `fetchAndUpdateRelease` is a single
 * request and a single upsert, with no intermediate position worth publishing,
 * so it takes no `onProgress` seam and the bar moves 0 → 100 on the framework's
 * step entry and completion writes alone.
 */
export const refreshHmmsTask = defineTask<typeof payload, TaskContext>({
	type: "refresh_hmms",
	payload,
	// Python names its step after the bound method it runs, `BaseTask.run`
	// writing `func.__name__` into the column. Both runners write `refresh` for
	// the same work until the cutover completes.
	steps: ["refresh"],
	async run({ ctx, helpers }) {
		await helpers.runStep("refresh", async () => {
			await fetchAndUpdateRelease(ctx.db);
		});
	},
});
