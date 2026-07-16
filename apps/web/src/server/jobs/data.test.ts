import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { seedUser } from "../auth/test/fixtures";
import type { Db } from "../db/pg";
import { jobs } from "../db/schema/jobs";
import { users } from "../db/schema/users";
import { createTestDatabase, type TestDatabase } from "../db/test/fixtures";
import { getJob, getJobs, JobNotFoundError } from "./data";

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
});

function byId(a: { id: number }, b: { id: number }) {
	return a.id - b.id;
}
