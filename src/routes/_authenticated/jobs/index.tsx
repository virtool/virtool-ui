import JobsList from "@jobs/components/JobList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const jobStateEnum = z.enum([
	"cancelled",
	"failed",
	"pending",
	"running",
	"succeeded",
]);

const initialState = ["pending", "running"] as const;

const jobsSearchSchema = z.object({
	state: z
		.array(jobStateEnum)
		.or(jobStateEnum.transform((val) => [val]))
		.default([...initialState])
		.catch([...initialState]),
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/jobs/")({
	validateSearch: jobsSearchSchema,
	component: JobsList,
});
