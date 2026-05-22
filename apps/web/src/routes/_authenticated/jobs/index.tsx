import JobsList from "@jobs/components/JobList";
import type { JobState } from "@jobs/types";
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
	component: JobsRoute,
});

function JobsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<JobsList
			page={search.page}
			states={search.state as JobState[]}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
