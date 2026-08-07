import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { seedUser } from "../auth/test/fixtures";
import type { Db } from "../db/pg";
import { analyses } from "../db/schema/analyses";
import { indexes } from "../db/schema/indexes";
import { jobs } from "../db/schema/jobs";
import { legacySamples } from "../db/schema/samples";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import {
	claimJob,
	finishJob,
	getJob,
	getJobs,
	JobNotFoundError,
	JobNotRunningError,
	JobStepAlreadyStartedError,
	JobStepNotFoundError,
	JobTerminalStateError,
	NoJobAvailableError,
	pingJob,
	startJobStep,
} from "./data";

let database: TestDatabase;
let db: Db;
let userId: number;

beforeAll(async () => {
	database = await createTestDatabase();
	db = database.db;
}, 60_000);

afterAll(async () => {
	await database.drop();
});

beforeEach(async () => {
	await db.delete(jobs);
	await db.delete(users);

	userId = await seedUser(db, { handle: "bob" });
});

async function seedJob(state: string, steps: { started: number; of: number }) {
	const [job] = await db
		.insert(jobs)
		.values({
			created_at: new Date(),
			state,
			steps: Array.from({ length: steps.of }, (_, index) => ({
				description: `step ${index}`,
				id: `step-${index}`,
				name: `step-${index}`,
				started_at: index < steps.started ? new Date().toISOString() : null,
			})),
			user_id: userId,
			workflow: "pathoscope",
		})
		.returning({ id: jobs.id });

	if (!job) {
		throw new Error("failed to seed job");
	}

	return job.id;
}

describe("getJobs", () => {
	it("reads every requested job in one call", async () => {
		const first = await seedJob("running", { started: 1, of: 4 });
		const second = await seedJob("running", { started: 3, of: 4 });

		const result = await getJobs(db, [first, second]);

		expect(
			result.map(({ id, progress }) => ({ id, progress })).sort(byId),
		).toEqual([
			{ id: first, progress: 25 },
			{ id: second, progress: 75 },
		]);
	});

	// A batch is best-effort: one job deleted between the frame and the read
	// must not cost the caller the rest of the wave.
	it("omits ids that match no job rather than failing the batch", async () => {
		const jobId = await seedJob("running", { started: 2, of: 4 });

		const result = await getJobs(db, [jobId, jobId + 5000]);

		expect(result.map(({ id }) => id)).toEqual([jobId]);
	});

	it("returns nothing for an empty id list without touching the database", async () => {
		await expect(getJobs(db, [])).resolves.toEqual([]);
	});
});

describe("getJob", () => {
	it("returns the job", async () => {
		const jobId = await seedJob("succeeded", { started: 0, of: 2 });

		await expect(getJob(db, jobId)).resolves.toMatchObject({
			id: jobId,
			progress: 100,
			state: "succeeded",
			user: { id: userId, handle: "bob" },
			workflow: "pathoscope",
		});
	});

	it("throws JobNotFoundError when the job is absent", async () => {
		await expect(getJob(db, 404_404)).rejects.toThrow(JobNotFoundError);
	});

	// A job that ran an analysis exposes the analysis's integer id as its
	// `analysis_id` arg, so the client links to `/analyses/<id>`. The id is
	// stringified because `args` is a string map.
	it("exposes a linked analysis's integer id as a string arg", async () => {
		const jobId = await seedJob("succeeded", { started: 0, of: 1 });

		const now = new Date();
		const [analysis] = await db
			.insert(analyses)
			.values({
				created_at: now,
				updated_at: now,
				sample: "0",
				user_id: 1,
				job_id: jobId,
				workflow: "nuvs",
				ready: false,
			})
			.returning({ id: analyses.id });
		if (!analysis) {
			throw new Error("failed to seed analysis");
		}

		const job = await getJob(db, jobId);

		expect(job.args.analysis_id).toBe(String(analysis.id));
	});

	// A create_sample job's sample is resolved through the reverse
	// `legacy_samples.job_id` foreign key — there is no `job_samples` link table
	// — and its integer id is exposed as the `sample_id` arg.
	it("exposes a linked sample's id as a string arg", async () => {
		const jobId = await seedJob("succeeded", { started: 0, of: 1 });

		const [sample] = await db
			.insert(legacySamples)
			.values({
				job_id: jobId,
				name: "Sample A",
				library_type: "normal",
				created_at: new Date(),
			})
			.returning({ id: legacySamples.id });
		if (!sample) {
			throw new Error("failed to seed sample");
		}

		const job = await getJob(db, jobId);

		expect(job.args.sample_id).toBe(String(sample.id));
	});

	// A build_index job's index is resolved through the reverse `indexes.job_id`
	// foreign key — there is no `job_indexes` link table — and its integer id is
	// exposed as the `index_id` arg.
	it("exposes a linked index's id as a string arg", async () => {
		const jobId = await seedJob("succeeded", { started: 0, of: 1 });

		const [index] = await db
			.insert(indexes)
			.values({
				created_at: new Date(),
				job_id: jobId,
				manifest: {},
				reference_id: 1,
				storage_key: "job-linked-index",
				user_id: 1,
				version: 0,
			})
			.returning({ id: indexes.id });
		if (!index) {
			throw new Error("failed to seed index");
		}

		const job = await getJob(db, jobId);

		expect(job.args.index_id).toBe(String(index.id));
	});
});

// The lifecycle transitions the jobs API serves. Most of their behaviour is
// pinned through the handlers that call them; what is here is the part HTTP
// cannot reach, because a job key stops authenticating the moment its job
// reaches a terminal state and the guard turns the request away first.
describe("the lifecycle transitions", () => {
	const steps = [
		{ id: "first", name: "First", description: "the first step" },
		{ id: "second", name: "Second", description: "the second step" },
	];

	function claim() {
		return claimJob(db, "pathoscope", {
			claim: {
				runner_id: "runner-1",
				mem: 4,
				cpu: 2,
				image: "image",
				runtime_version: "1.0.0",
				workflow_version: "2.0.0",
			},
			steps,
		});
	}

	/** Put a job in the queue and take it, the way a run starts. */
	async function claimFresh() {
		await seedJob("pending", { started: 0, of: 0 });

		return claim();
	}

	it("refuses to claim when nothing is waiting", async () => {
		await expect(claim()).rejects.toBeInstanceOf(NoJobAvailableError);
	});

	// The row is read, one element replaced and the whole array written back,
	// because a JSONB array has no addressable element in SQL. This pins that
	// merge: neither call may write back an array built from the state before
	// the other. It does **not** prove the `FOR UPDATE` — the test fixture opens
	// a single connection, so these two transactions queue rather than race, and
	// the lock is what carries the same guarantee against a real pool.
	it("keeps both steps when they start at the same moment", async () => {
		const claimed = await claimFresh();

		await Promise.all([
			startJobStep(db, claimed.id, "first"),
			startJobStep(db, claimed.id, "second"),
		]);

		const job = await getJob(db, claimed.id);

		expect(job.steps?.every((step) => step.started_at !== null)).toBe(true);
		expect(job.progress).toBe(100);
	});

	// Only reachable as a race: the guard reads the state, and the job is
	// cancelled before the transaction below takes its lock. Rare, and the
	// reason the check is here rather than trusted from the guard's read.
	it("refuses to start a step on a job that has reached a terminal state", async () => {
		const claimed = await claimFresh();

		await db
			.update(jobs)
			.set({ state: "cancelled" })
			.where(eq(jobs.id, claimed.id));

		await expect(startJobStep(db, claimed.id, "first")).rejects.toBeInstanceOf(
			JobTerminalStateError,
		);
	});

	it("refuses to start a step the job does not have", async () => {
		const claimed = await claimFresh();

		await expect(startJobStep(db, claimed.id, "third")).rejects.toBeInstanceOf(
			JobStepNotFoundError,
		);
	});

	it("refuses to start a step twice", async () => {
		const claimed = await claimFresh();

		await startJobStep(db, claimed.id, "first");

		await expect(startJobStep(db, claimed.id, "first")).rejects.toBeInstanceOf(
			JobStepAlreadyStartedError,
		);
	});

	it.each(["pending", "cancelled", "failed", "succeeded"])(
		"refuses to finish a job that is %s",
		async (state) => {
			const claimed = await claimFresh();

			await db.update(jobs).set({ state }).where(eq(jobs.id, claimed.id));

			await expect(finishJob(db, claimed.id)).rejects.toBeInstanceOf(
				JobNotRunningError,
			);
		},
	);

	it("reports a ping against a job that no longer exists", async () => {
		const claimed = await claimFresh();

		await db.delete(jobs).where(eq(jobs.id, claimed.id));

		await expect(pingJob(db, claimed.id)).rejects.toBeInstanceOf(
			JobNotFoundError,
		);
	});
});

function byId(a: { id: number }, b: { id: number }) {
	return a.id - b.id;
}
