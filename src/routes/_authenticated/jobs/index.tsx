import JobsList from "@jobs/components/JobList";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

const jobsSearchSchema = z.object({
	state: z
		.array(z.enum(["cancelled", "failed", "pending", "running", "succeeded"]))
		.default([])
		.catch([]),
	page: z.number().default(1).catch(1),
});

export const Route = createFileRoute("/_authenticated/jobs/")({
	validateSearch: jobsSearchSchema,
	component: JobsList,
});
