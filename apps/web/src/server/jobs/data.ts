import { count, desc, eq, inArray } from "drizzle-orm";
import type { Db } from "../db/pg";
import {
	type JobClaim,
	type JobStep,
	jobAnalyses,
	jobIndexes,
	jobSamples,
	jobSubtractions,
	jobs,
} from "../db/schema/jobs";
import { users } from "../db/schema/users";
import { AppError } from "../errors";

/** One of a job's lifecycle states. */
export type JobState =
	| "cancelled"
	| "failed"
	| "pending"
	| "running"
	| "succeeded";

const JOB_STATES: JobState[] = [
	"cancelled",
	"failed",
	"pending",
	"running",
	"succeeded",
];

/** A job as it appears in a search result list. */
export type JobMinimal = {
	id: number;
	created_at: Date;
	progress: number;
	state: string;
	user: { id: number; handle: string };
	workflow: string;
};

/** A full job, as returned by the detail endpoint. */
export type Job = {
	args: Record<string, string>;
	id: number;
	claim: JobClaim | null;
	claimed_at: Date | null;
	created_at: Date;
	finished_at: Date | null;
	progress: number;
	state: string;
	steps: JobStep[] | null;
	user: { id: number; handle: string };
	workflow: string;
};

/** A page of jobs with per-state/workflow counts and pagination metadata. */
export type JobSearchResult = {
	counts: Record<string, Record<string, number>>;
	found_count: number;
	items: JobMinimal[];
	page: number;
	page_count: number;
	per_page: number;
	total_count: number;
};

/** Filters and pagination accepted by {@link findJobs}. */
export type FindJobsOptions = {
	page: number;
	perPage: number;
	states: JobState[];
};

/** Thrown when a requested job does not exist. */
export class JobNotFoundError extends AppError {}

// Mirror of the Python `compute_progress` helper: terminal jobs are 100%, a
// running job is the fraction of its steps that have started, everything else
// is 0%.
function computeProgress(state: string, steps: JobStep[] | null): number {
	if (state === "succeeded" || state === "failed" || state === "cancelled") {
		return 100;
	}

	if (state !== "running" || !steps || steps.length === 0) {
		return 0;
	}

	const started = steps.filter((step) => step.started_at != null).length;
	return Math.floor((started / steps.length) * 100);
}

function buildCounts(
	rows: { state: string; workflow: string; count: number }[],
): Record<string, Record<string, number>> {
	const counts: Record<string, Record<string, number>> = {};

	// Seed every state so empty states report 0 rather than going missing.
	for (const state of JOB_STATES) {
		counts[state] = {};
	}

	for (const row of rows) {
		if (!counts[row.state]) {
			counts[row.state] = {};
		}
		counts[row.state][row.workflow] = row.count;
	}

	return counts;
}

export async function findJobs(
	db: Db,
	{ page, perPage, states }: FindJobsOptions,
): Promise<JobSearchResult> {
	// TODO: the Python endpoint also accepts a `users` filter; add it here if a
	// caller needs to scope jobs by user.
	const stateFilter = states.length ? inArray(jobs.state, states) : undefined;

	const [countRows, [{ value: totalCount }], [{ value: foundCount }], rows] =
		await Promise.all([
			db
				.select({
					state: jobs.state,
					workflow: jobs.workflow,
					count: count(),
				})
				.from(jobs)
				.groupBy(jobs.state, jobs.workflow),
			db.select({ value: count() }).from(jobs),
			db.select({ value: count() }).from(jobs).where(stateFilter),
			db
				.select({
					id: jobs.id,
					created_at: jobs.created_at,
					state: jobs.state,
					steps: jobs.steps,
					workflow: jobs.workflow,
					userId: users.id,
					handle: users.handle,
				})
				.from(jobs)
				.innerJoin(users, eq(jobs.user_id, users.id))
				.where(stateFilter)
				.orderBy(desc(jobs.created_at))
				.offset(page > 1 ? (page - 1) * perPage : 0)
				.limit(perPage),
		]);

	const items = rows.map((row) => ({
		id: row.id,
		created_at: row.created_at,
		progress: computeProgress(row.state, row.steps),
		state: row.state,
		user: { id: row.userId, handle: row.handle },
		workflow: row.workflow,
	}));

	return {
		counts: buildCounts(countRows),
		found_count: foundCount,
		items,
		page,
		page_count: foundCount ? Math.ceil(foundCount / perPage) : 0,
		per_page: perPage,
		total_count: totalCount,
	};
}

export async function getJob(db: Db, jobId: number): Promise<Job> {
	const [row] = await db
		.select({
			id: jobs.id,
			claim: jobs.claim,
			claimed_at: jobs.claimed_at,
			created_at: jobs.created_at,
			finished_at: jobs.finished_at,
			state: jobs.state,
			steps: jobs.steps,
			workflow: jobs.workflow,
			userId: users.id,
			handle: users.handle,
			sample_id: jobSamples.sample_id,
			index_id: jobIndexes.index_id,
			subtraction_id: jobSubtractions.subtraction_id,
			analysis_id: jobAnalyses.analysis_id,
		})
		.from(jobs)
		.innerJoin(users, eq(jobs.user_id, users.id))
		.leftJoin(jobSamples, eq(jobs.id, jobSamples.job_id))
		.leftJoin(jobIndexes, eq(jobs.id, jobIndexes.job_id))
		.leftJoin(jobSubtractions, eq(jobs.id, jobSubtractions.job_id))
		.leftJoin(jobAnalyses, eq(jobs.id, jobAnalyses.job_id))
		.where(eq(jobs.id, jobId));

	if (!row) {
		throw new JobNotFoundError();
	}

	// `args` is reconstructed from the resource junction tables — the legacy
	// Mongo `args` field is not stored as a column.
	const args: Record<string, string> = {};
	if (row.sample_id != null) {
		args.sample_id = row.sample_id;
	}
	if (row.index_id != null) {
		args.index_id = row.index_id;
	}
	if (row.subtraction_id != null) {
		args.subtraction_id = row.subtraction_id;
	}
	if (row.analysis_id != null) {
		args.analysis_id = row.analysis_id;
	}

	return {
		args,
		id: row.id,
		claim: row.claim ?? null,
		claimed_at: row.claimed_at,
		created_at: row.created_at,
		finished_at: row.finished_at,
		progress: computeProgress(row.state, row.steps),
		state: row.state,
		steps: row.steps,
		user: { id: row.userId, handle: row.handle },
		workflow: row.workflow,
	};
}
