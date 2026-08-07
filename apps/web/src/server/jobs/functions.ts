import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { JobState, JobWorkflow } from "@virtool/contracts";
import {
	findJobs,
	getJob,
	getJobs,
	type Job,
	type JobMinimal,
	JobNotFoundError,
	type JobSearchResult,
} from "@virtool/data/jobs/data";
import { z } from "zod";
import { authenticated } from "../auth/policy";
import { db } from "../composition";
import { ClientError } from "../errors";
import { rowIdSchema } from "../validation";

const findJobsSchema = z.object({
	page: z.number().int().min(1).default(1),
	perPage: z.number().int().min(1).max(100).default(25),
	states: z.array(JobState).default([]),
});

const jobIdSchema = z.object({
	jobId: rowIdSchema,
});

// Capped at the same 100 as a `findJobs` page: the batch exists to collapse one
// refetch per on-screen job into one request, and no view shows more than a
// page of them at once.
const jobIdsSchema = z.object({
	jobIds: z.array(rowIdSchema).min(1).max(100),
});

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// JobNotFoundError import it references — from the client bundle. A plain
// top-level helper would pin ./data and its postgres transitive dependency in
// the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof JobNotFoundError) {
		setResponseStatus(404);
		throw new ClientError("Job not found.");
	}
	throw err;
});

/** A job as this app publishes it to the SPA. */
type WireJob = Omit<Job, "workflow"> & { workflow: JobWorkflow };

/** A job in a page of search results, as this app publishes it. */
type WireJobMinimal = Omit<JobMinimal, "workflow"> & { workflow: JobWorkflow };

/** A page of jobs, as this app publishes it. */
type WireJobSearchResult = Omit<JobSearchResult, "items"> & {
	items: WireJobMinimal[];
};

/**
 * Narrow a row's `workflow` onto the union the SPA reads.
 *
 * `jobs.workflow` is a `text` column carrying no CHECK constraint, so the data
 * layer types it as a plain string. The SPA renders a workflow name as a label
 * and a link and so reads the closed union, and this is the boundary that
 * publishes the wire shape — narrowing here rather than declaring the union on
 * the client is what makes the two disagreeing a type error.
 *
 * A row that does not fit is a **bare throw**, not a `ClientError`: nothing the
 * caller sent is wrong, and this side owns the data. That is a 500 and a Sentry
 * event naming the job, rather than routine control flow the `beforeSend`
 * filter drops.
 *
 * The message carries the id and never the value. It is a Sentry title, and an
 * unbounded one buries the incident among its own variants.
 */
function narrowWorkflow(job: { id: number; workflow: string }): JobWorkflow {
	const parsed = JobWorkflow.safeParse(job.workflow);

	if (!parsed.success) {
		throw new Error(`job ${job.id} names a workflow this build does not know`);
	}

	return parsed.data;
}

function toWireJob(job: Job): WireJob {
	return { ...job, workflow: narrowWorkflow(job) };
}

function toWireJobMinimal(job: JobMinimal): WireJobMinimal {
	return { ...job, workflow: narrowWorkflow(job) };
}

export const findJobsFn = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(findJobsSchema)
	.handler(async ({ data }): Promise<WireJobSearchResult> => {
		const result = await findJobs(db, data);

		return { ...result, items: result.items.map(toWireJobMinimal) };
	});

export const getJobsFn = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(jobIdsSchema)
	.handler(async ({ data }): Promise<WireJob[]> => {
		const found = await getJobs(db, data.jobIds);

		return found.map(toWireJob);
	});

export const getJobFn = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(jobIdSchema)
	.handler(async ({ data }): Promise<WireJob> => {
		try {
			return toWireJob(await getJob(db, data.jobId));
		} catch (err) {
			return await rethrowAsHttp(err);
		}
	});
