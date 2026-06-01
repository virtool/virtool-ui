import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { setResponseStatus } from "@tanstack/react-start/server";
import { z } from "zod";
import { db } from "../db/pg";
import {
	findJobs as findJobsImpl,
	getJob as getJobImpl,
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

export const findJobs = createServerFn({ method: "GET" })
	.inputValidator(findJobsSchema)
	.handler(async ({ data }) => findJobsImpl(db, data));

export const getJob = createServerFn({ method: "GET" })
	.inputValidator(jobIdSchema)
	.handler(async ({ data }) => {
		try {
			return await getJobImpl(db, data.jobId);
		} catch (err) {
			rethrowAsHttp(err);
		}
	});
