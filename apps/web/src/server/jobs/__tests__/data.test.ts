import { afterAll, beforeAll, describe, expect, it } from "vitest";
import {
	type FindJobsOptions,
	findJobs,
	getJob,
	JobNotFoundError,
	type JobState,
	resolveJobScope,
} from "../data";
import { createTestDb, seedJob, seedUser, type TestDb } from "../test/fixtures";

let testDb: TestDb;
let alice: number;
let bob: number;
let aliceRunning: number;
let aliceFailed: number;
let bobRunning: number;

beforeAll(async () => {
	testDb = await createTestDb("jobs_data_test");

	alice = await seedUser(testDb.db, "alice");
	bob = await seedUser(testDb.db, "bob");

	aliceRunning = await seedJob(testDb.db, alice, {
		state: "running",
		workflow: "create_sample",
	});
	aliceFailed = await seedJob(testDb.db, alice, {
		state: "failed",
		workflow: "build_index",
	});
	bobRunning = await seedJob(testDb.db, bob, {
		state: "running",
		workflow: "create_sample",
	});
});

afterAll(async () => {
	await testDb.close();
});

function options(
	scopeUserId: number | null,
	states: JobState[] = [],
): FindJobsOptions {
	return { page: 1, perPage: 25, scopeUserId, states };
}

describe("resolveJobScope", () => {
	it("restricts a user with no administrator role to their own jobs", () => {
		expect(resolveJobScope(7, null)).toBe(7);
	});

	it.each([
		"base",
		"users",
		"spaces",
		"settings",
		"full",
	] as const)("lets a %s administrator read across every user", (role) => {
		expect(resolveJobScope(7, role)).toBeNull();
	});
});

describe("findJobs", () => {
	it("returns only the scoped user's jobs", async () => {
		const result = await findJobs(testDb.db, options(alice));

		expect(result.items.map((job) => job.id).sort()).toEqual(
			[aliceRunning, aliceFailed].sort(),
		);
		expect(result.items.every((job) => job.user.handle === "alice")).toBe(true);
	});

	it("scopes the counts and totals, not just the items", async () => {
		const result = await findJobs(testDb.db, options(alice));

		expect(result.total_count).toBe(2);
		expect(result.found_count).toBe(2);
		expect(result.counts.running).toEqual({ create_sample: 1 });
		expect(result.counts.failed).toEqual({ build_index: 1 });
	});

	it("returns every user's jobs when unscoped", async () => {
		const result = await findJobs(testDb.db, options(null));

		expect(result.items.map((job) => job.id).sort()).toEqual(
			[aliceRunning, aliceFailed, bobRunning].sort(),
		);
		expect(result.total_count).toBe(3);
		expect(result.counts.running).toEqual({ create_sample: 2 });
	});

	it("applies the state filter on top of the owner scope", async () => {
		const result = await findJobs(testDb.db, options(alice, ["running"]));

		expect(result.items.map((job) => job.id)).toEqual([aliceRunning]);
		expect(result.found_count).toBe(1);
		// The total is the scoped user's whole job count, unnarrowed by state.
		expect(result.total_count).toBe(2);
	});

	it("does not leak another user's jobs through the state filter", async () => {
		const result = await findJobs(testDb.db, options(alice, ["running"]));

		expect(result.items.map((job) => job.id)).not.toContain(bobRunning);
	});
});

describe("getJob", () => {
	it("returns a job to its owner", async () => {
		const job = await getJob(testDb.db, aliceRunning, alice);

		expect(job.id).toBe(aliceRunning);
		expect(job.user.handle).toBe("alice");
	});

	it("reports another user's job as missing rather than forbidden", async () => {
		await expect(getJob(testDb.db, bobRunning, alice)).rejects.toBeInstanceOf(
			JobNotFoundError,
		);
	});

	it("returns any user's job when unscoped", async () => {
		const job = await getJob(testDb.db, bobRunning, null);

		expect(job.id).toBe(bobRunning);
		expect(job.user.handle).toBe("bob");
	});

	it("throws for a job that does not exist", async () => {
		await expect(getJob(testDb.db, 9999, null)).rejects.toBeInstanceOf(
			JobNotFoundError,
		);
	});
});
