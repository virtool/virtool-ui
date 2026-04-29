import z from "zod";

const JobStateSchema = z.enum([
	"cancelled",
	"failed",
	"pending",
	"running",
	"succeeded",
]);
export type JobState = z.infer<typeof JobStateSchema>;

export const Workflow = z.literal([
	"build_index",
	"create_sample",
	"create_subtraction",
	"nuvs",
	"pathoscope",
	"iimi",
]);
export type Workflow = z.infer<typeof Workflow>;

export const JobNestedSchema = z
	.object({
		created_at: z.coerce.date(),
		id: z.int(),
		progress: z.int(),
		state: JobStateSchema,
		user: z.object({
			handle: z.string(),
			id: z.int(),
		}),
		workflow: Workflow,
	})
	.transform(({ created_at, id, progress, state, user, workflow }) => ({
		createdAt: created_at,
		id,
		progress,
		state,
		user,
		workflow,
	}));
export type ServerJobNested = z.input<typeof JobNestedSchema>;
export type JobNested = z.infer<typeof JobNestedSchema>;

export const JobMinimalSchema = z
	.object({
		id: z.int(),
		created_at: z.coerce.date(),
		progress: z.int(),
		state: JobStateSchema,
		user: z.object({
			id: z.int(),
			handle: z.string(),
		}),
		workflow: Workflow,
	})
	.transform(({ created_at, id, progress, state, user, workflow }) => ({
		createdAt: created_at,
		id,
		progress,
		state,
		user,
		workflow,
	}));

export type ServerJobMinimal = z.input<typeof JobMinimalSchema>;
export type JobMinimal = z.infer<typeof JobMinimalSchema>;

const JobStepSchema = z
	.object({
		description: z.string(),
		id: z.string(),
		name: z.string(),
		started_at: z.preprocess(
			(val) => (val ? new Date(val as string) : null),
			z.date().nullable(),
		),
	})
	.transform(({ id, name, description, started_at }) => ({
		id,
		name,
		description,
		startedAt: started_at,
	}));
export type ServerJobStep = z.input<typeof JobStepSchema>;
export type JobStep = z.infer<typeof JobStepSchema>;

const JobClaimSchema = z
	.object({
		cpu: z.number(),
		image: z.string(),
		mem: z.number(),
		runner_id: z.string(),
		runtime_version: z.string(),
		workflow_version: z.string(),
	})
	.transform(
		({ cpu, image, mem, runner_id, runtime_version, workflow_version }) => ({
			cpu,
			image,
			mem,
			runnerId: runner_id,
			runtimeVersion: runtime_version,
			workflowVersion: workflow_version,
		}),
	);
export type ServerJobClaim = z.input<typeof JobClaimSchema>;
export type JobClaim = z.infer<typeof JobClaimSchema>;

export const JobSchema = z
	.object({
		args: z.record(z.string(), z.unknown()),
		id: z.int(),
		claim: JobClaimSchema.nullish(),
		claimed_at: z.preprocess(
			(val) => (val ? new Date(val as string) : null),
			z.date().nullable(),
		),
		created_at: z.coerce.date(),
		finished_at: z.preprocess(
			(val) => (val ? new Date(val as string) : null),
			z.date().nullable(),
		),
		progress: z.int(),
		steps: z.array(JobStepSchema).nullable(),
		state: JobStateSchema,
		user: z.object({
			id: z.int(),
			handle: z.string(),
		}),
		workflow: Workflow,
	})
	.transform(({ claimed_at, created_at, finished_at, state, ...rest }) => ({
		...rest,
		claimedAt: claimed_at,
		createdAt: created_at,
		finishedAt: finished_at,
		state,
	}));
export type ServerJob = z.input<typeof JobSchema>;
export type Job = z.infer<typeof JobSchema>;

const JobCountsSchema = z
	.record(z.string(), z.record(z.string(), z.number()))
	.transform((counts) => {
		const result: Partial<Record<JobState, number>> = {};
		for (const state of Object.keys(counts) as JobState[]) {
			result[state] = Object.values(counts[state]).reduce(
				(sum, count) => sum + count,
				0,
			);
		}
		return result as Record<JobState, number>;
	});

export type JobCounts = z.infer<typeof JobCountsSchema>;

export const JobSearchResultSchema = z
	.object({
		counts: JobCountsSchema,
		found_count: z.number(),
		items: z.array(JobMinimalSchema),
		page: z.number(),
		page_count: z.number(),
		per_page: z.number(),
		total_count: z.number(),
	})
	.transform(
		({
			counts,
			found_count,
			items,
			page,
			page_count,
			per_page,
			total_count,
		}) => ({
			counts,
			foundCount: found_count,
			items,
			page,
			pageCount: page_count,
			perPage: per_page,
			totalCount: total_count,
		}),
	);

export type ServerJobSearchResult = z.input<typeof JobSearchResultSchema>;
export type JobSearchResult = z.infer<typeof JobSearchResultSchema>;
