import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { getSessionAdminRole, requireSession } from "../auth/middleware";
import { db } from "../db/pg";
import {
	findJobs as findJobsImpl,
	getJob as getJobImpl,
	JOB_STATES,
	JobNotFoundError,
	resolveJobScope,
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

// Wrapped in createServerOnlyFn so the compiler can strip this body — and the
// JobNotFoundError import it references — from the client bundle. A plain
// top-level helper would pin ./data and its postgres transitive dependency in
// the client graph.
const rethrowAsHttp = createServerOnlyFn((err: unknown): never => {
	if (err instanceof JobNotFoundError) {
		setResponseStatus(404);
		throw new Error("Job not found.");
	}
	throw err;
});

// Jobs expose the owning user's handle and the ids of the samples, indexes and
// analyses they ran against. Administrators read across the instance; everyone
// else is restricted to the jobs they own.
const scopeForSession = createServerOnlyFn(async (): Promise<number | null> => {
	const session = await requireSession();
	return resolveJobScope(session.userId, await getSessionAdminRole(session));
});

export const findJobs = createServerFn({ method: "GET" })
	.validator(findJobsSchema)
	.handler(async ({ data }) =>
		findJobsImpl(db, { ...data, scopeUserId: await scopeForSession() }),
	);

export const getJob = createServerFn({ method: "GET" })
	.validator(jobIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getJobImpl(db, data.jobId, await scopeForSession());
		} catch (err) {
			await rethrowAsHttp(err);
		}
	});
