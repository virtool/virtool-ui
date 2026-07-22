import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { authenticated } from "../auth/policy";
import { db } from "../db/pg";
import { ClientError } from "../errors";
import {
	findJobs as findJobsImpl,
	getJob as getJobImpl,
	getJobs as getJobsImpl,
	JOB_STATES,
	JobNotFoundError,
} from "./data";

const jobStateSchema = z.enum(JOB_STATES);

const findJobsSchema = z.object({
	page: z.number().int().min(1).default(1),
	perPage: z.number().int().min(1).max(100).default(25),
	states: z.array(jobStateSchema).default([]),
});

const jobIdSchema = z.object({
	jobId: z.number().int().positive(),
});

// Capped at the same 100 as a `findJobs` page: the batch exists to collapse one
// refetch per on-screen job into one request, and no view shows more than a
// page of them at once.
const jobIdsSchema = z.object({
	jobIds: z.array(z.number().int().positive()).min(1).max(100),
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

export const findJobs = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(findJobsSchema)
	.handler(async ({ data }) => findJobsImpl(db, data));

export const getJobs = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(jobIdsSchema)
	.handler(async ({ data }) => getJobsImpl(db, data.jobIds));

export const getJob = createServerFn({ method: "GET" })
	.middleware([authenticated()])
	.validator(jobIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getJobImpl(db, data.jobId);
		} catch (err) {
			await rethrowAsHttp(err);
		}
	});
