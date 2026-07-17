import { num, oneOfArray } from "@app/searchParams";
import JobsList from "@jobs/components/JobList";
import type { JobState } from "@jobs/types";
import type { SearchSchemaInput } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

const jobStates = [
	"cancelled",
	"failed",
	"pending",
	"running",
	"succeeded",
] as const satisfies ReadonlyArray<JobState>;

const initialState: JobState[] = ["pending", "running"];

/** Search params for the jobs list. */
type JobsSearch = {
	state: JobState[];
	page: number;
};

function validateJobsSearch(
	input: Partial<JobsSearch> & SearchSchemaInput,
): JobsSearch {
	return {
		state: oneOfArray(input.state, jobStates, initialState),
		page: num(input.page, 1),
	};
}

export const Route = createFileRoute("/_authenticated/jobs/")({
	validateSearch: validateJobsSearch,
	loaderDeps: ({ search: { page, state } }) => ({ page, state }),
	loader: async ({ context: { queryClient }, deps: { page, state } }) => {
		const { jobsQueryOptions } = await import("@jobs/queries");
		await queryClient.ensureQueryData(jobsQueryOptions(page, 25, state));
	},
	component: JobsRoute,
});

function JobsRoute() {
	const search = Route.useSearch();
	const navigate = Route.useNavigate();

	return (
		<JobsList
			page={search.page}
			states={search.state}
			setSearch={(next) => navigate({ search: { ...search, ...next } })}
		/>
	);
}
