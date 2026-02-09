import z from "zod";

const JobStateSchema = z.enum([
    "cancelled",
    "failed",
    "pending",
    "running",
    "succeeded",
]);
export type JobState = z.infer<typeof JobStateSchema>;

const JobStateV1Schema = z.enum([
    "cancelled",
    "complete",
    "error",
    "preparing",
    "running",
    "terminated",
    "timeout",
    "waiting",
]);
type JobStateV1 = z.infer<typeof JobStateV1Schema>;

const V1_TO_V2_STATE: Record<JobStateV1, JobState> = {
    cancelled: "cancelled",
    complete: "succeeded",
    error: "failed",
    preparing: "running",
    running: "running",
    terminated: "failed",
    timeout: "failed",
    waiting: "pending",
};

export const Workflow = z.preprocess(
    (val) => (val === "pathoscope_bowtie" ? "pathoscope" : val),
    z.enum([
        "build_index",
        "create_sample",
        "create_subtraction",
        "nuvs",
        "pathoscope",
        "iimi",
    ]),
);
export type Workflow = z.infer<typeof Workflow>;
export type ServerWorkflow = z.input<typeof Workflow>;

export const JobNested = z
    .object({
        created_at: z.coerce.date(),
        id: z.string(),
        progress: z.int(),
        state: JobStateV1Schema,
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
        state: V1_TO_V2_STATE[state],
        user,
        workflow,
    }));
export type ServerJobNested = z.input<typeof JobNested>;
export type JobNested = z.infer<typeof JobNested>;

export const JobMinimal = z
    .object({
        id: z.string(),
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

export type ServerJobMinimal = z.input<typeof JobMinimal>;
export type JobMinimal = z.infer<typeof JobMinimal>;

const JobStep = z
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
export type ServerJobStep = z.input<typeof JobStep>;
export type JobStep = z.infer<typeof JobStep>;

const JobClaim = z
    .object({
        cpu: z.number(),
        image: z.string(),
        mem: z.number(),
        runner_id: z.string(),
        runtime_version: z.string(),
        workflow_version: z.string(),
    })
    .transform(
        ({
            cpu,
            image,
            mem,
            runner_id,
            runtime_version,
            workflow_version,
        }) => ({
            cpu,
            image,
            mem,
            runnerId: runner_id,
            runtimeVersion: runtime_version,
            workflowVersion: workflow_version,
        }),
    );
export type ServerJobClaim = z.input<typeof JobClaim>;
export type JobClaim = z.infer<typeof JobClaim>;

export const Job = z
    .object({
        args: z.record(z.string(), z.unknown()),
        id: z.string(),
        claim: JobClaim.nullish(),
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
        steps: z.array(JobStep).nullable(),
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
export type ServerJob = z.input<typeof Job>;
export type Job = z.infer<typeof Job>;

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

export const JobSearchResult = z
    .object({
        counts: JobCountsSchema,
        found_count: z.number(),
        items: z.array(JobMinimal),
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

export type ServerJobSearchResult = z.input<typeof JobSearchResult>;
export type JobSearchResult = z.infer<typeof JobSearchResult>;
