import type { AdministratorRoleName } from "@administration/types";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import type { Db } from "../db/pg";
import { takeFirstOrThrow } from "../db/rows";
import { analyses } from "../db/schema/analyses";
import {
	type JobClaim,
	type JobStep,
	jobIndexes,
	jobSamples,
	jobs,
} from "../db/schema/jobs";
import { subtractions } from "../db/schema/subtractions";
import { users } from "../db/schema/users";
import { AppError } from "../errors";

/** The canonical list of a job's lifecycle states. */
export const JOB_STATES = [
	"cancelled",
	"failed",
	"pending",
	"running",
	"succeeded",
] as const;

/** One of a job's lifecycle states. */
export type JobState = (typeof JOB_STATES)[number];

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
	/**
	 * Restrict the result to jobs owned by this user, or `null` to read across
	 * every user. Required rather than optional so a caller can't omit it and
	 * silently get an instance-wide read.
	 */
	scopeUserId: number | null;
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
		const workflowCounts = counts[row.state] ?? {};
		counts[row.state] = workflowCounts;
		workflowCounts[row.workflow] = row.count;
	}

	return counts;
}

export async function findJobs(
	db: Db,
	{ page, perPage, scopeUserId, states }: FindJobsOptions,
): Promise<JobSearchResult> {
	// The owner scope is the authorization boundary, so it has to constrain the
	// aggregates as well as the page of items. Counts and totals taken over the
	// whole table would leak instance-wide activity to a scoped caller even
	// though they can't see the jobs behind the numbers.
	//
	// Note this is not the Python endpoint's caller-supplied `users` filter,
	// which narrows a search the caller is already entitled to make. That filter
	// is still unimplemented here.
	const ownerFilter =
		scopeUserId === null ? undefined : eq(jobs.user_id, scopeUserId);
	const stateFilter = states.length ? inArray(jobs.state, states) : undefined;
	const foundFilter = and(ownerFilter, stateFilter);

	const [countRows, totalCountRows, foundCountRows, rows] = await Promise.all([
		db
			.select({
				state: jobs.state,
				workflow: jobs.workflow,
				count: count(),
			})
			.from(jobs)
			.where(ownerFilter)
			.groupBy(jobs.state, jobs.workflow),
		db.select({ value: count() }).from(jobs).where(ownerFilter),
		// Without a state filter the found count equals the total count, so
		// skip the redundant query and reuse totalCount below.
		stateFilter
			? db.select({ value: count() }).from(jobs).where(foundFilter)
			: undefined,
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
			.where(foundFilter)
			.orderBy(desc(jobs.created_at))
			.offset((page - 1) * perPage)
			.limit(perPage),
	]);

	const totalCount = takeFirstOrThrow(totalCountRows).value;
	const foundCount = foundCountRows
		? takeFirstOrThrow(foundCountRows).value
		: totalCount;

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

/**
 * A job is readable by its owner, and by any administrator. Returns the user id
 * a read should be restricted to, or `null` to read across every user.
 *
 * Ownership is a coarser rule than we would like. A job that produced a shared
 * resource — a sample with `all_read`, an index on a reference the caller
 * belongs to — is readable through that resource but not through here, so the
 * nested job cards seeded from those resources stop refetching progress once
 * the job owner isn't the viewer. The rule we want is "readable if you can read
 * the resource it produced", but sample and reference permissions live in Mongo
 * on the Python side; Postgres has no `samples` table and no rights data, so
 * this side cannot evaluate that check yet. Revisit when those domains migrate.
 */
export function resolveJobScope(
	userId: number,
	adminRole: AdministratorRoleName | null,
): number | null {
	return adminRole === null ? userId : null;
}

/**
 * Fetch a single job. A `scopeUserId` restricts the read to that user's jobs,
 * so a job owned by someone else is reported as missing rather than forbidden —
 * a 403 would confirm the job exists to a caller who can't see it.
 */
export async function getJob(
	db: Db,
	jobId: number,
	scopeUserId: number | null,
): Promise<Job> {
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
			subtraction_id: subtractions.id,
			analysis_id: analyses.legacy_id,
		})
		.from(jobs)
		.innerJoin(users, eq(jobs.user_id, users.id))
		.leftJoin(jobSamples, eq(jobs.id, jobSamples.job_id))
		.leftJoin(jobIndexes, eq(jobs.id, jobIndexes.job_id))
		.leftJoin(subtractions, eq(jobs.id, subtractions.job_id))
		.leftJoin(analyses, eq(jobs.id, analyses.job_id))
		.where(
			and(
				eq(jobs.id, jobId),
				scopeUserId === null ? undefined : eq(jobs.user_id, scopeUserId),
			),
		);

	if (!row) {
		throw new JobNotFoundError();
	}

	// `args` is reconstructed from the related resources — the legacy Mongo
	// `args` field is not stored as a column. Samples and indexes come from the
	// `job_*` junction tables; the subtraction and analysis are found on the
	// owning rows.
	const args: Record<string, string> = {};
	if (row.sample_id != null) {
		args.sample_id = row.sample_id;
	}
	if (row.index_id != null) {
		args.index_id = row.index_id;
	}
	if (row.subtraction_id != null) {
		args.subtraction_id = String(row.subtraction_id);
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
