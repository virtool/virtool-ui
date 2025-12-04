import z from "zod";
import { SearchResult } from "../types/api";

const ServerJobStateSchema = z.enum([
    "cancelled",
    "complete",
    "error",
    "preparing",
    "running",
    "terminated",
    "timeout",
    "waiting",
]);
export type ServerJobState = z.infer<typeof ServerJobStateSchema>;

const JobStateSchema = z.enum([
    "cancelled",
    "failed",
    "pending",
    "running",
    "succeeded",
]);
export type JobState = z.infer<typeof JobStateSchema>;

const serverToClientState: Record<ServerJobState, JobState> = {
    cancelled: "cancelled",
    complete: "succeeded",
    error: "failed",
    preparing: "running",
    running: "running",
    terminated: "failed",
    timeout: "failed",
    waiting: "pending",
};

const JobStateParsed = ServerJobStateSchema.transform(
    (val) => serverToClientState[val],
);

export const jobStates: JobState[] = JobStateSchema.options;

export const jobStateToLegacy: Record<JobState, ServerJobState[]> = {
    cancelled: ["cancelled"],
    failed: ["error", "terminated", "timeout"],
    pending: ["waiting"],
    running: ["preparing", "running"],
    succeeded: ["complete"],
};

export const Workflow = z.preprocess(
    (val) => (val === "pathoscope_bowtie" ? "pathoscope" : val),
    z.enum([
        "build_index",
        "create_sample",
        "create_subtraction",
        "nuvs",
        "pathoscope",
    ]),
);
export type Workflow = z.infer<typeof Workflow>;
export type ServerWorkflow = z.input<typeof Workflow>;

export const JobMinimal = z
    .object({
        id: z.string(),
        created_at: z.coerce.date(),
        progress: z.int(),
        stage: z.string().nullable(),
        state: JobStateParsed,
        user: z.object({
            id: z.int(),
            handle: z.string(),
        }),
        workflow: Workflow,
    })
    .transform(
        ({ created_at, id, progress, stage, state, user, workflow }) => ({
            createdAt: created_at,
            id,
            progress,
            state,
            step: stage,
            user,
            workflow,
        }),
    );

export type ServerJobMinimal = z.input<typeof JobMinimal>;
export type JobMinimal = z.infer<typeof JobMinimal>;

const JobStep = z
    .object({
        stage: z.string(),
        step_name: z.string(),
        step_description: z.string(),
        timestamp: z.coerce.date(),
    })
    .transform((data) => ({
        name: data.step_name || data.stage,
        description: data.step_description,
        startedAt: data.timestamp,
    }));

export type ServerJobStep = z.input<typeof JobStep>;
export type JobStep = z.infer<typeof JobStep>;

const terminalStates = ["cancelled", "failed", "succeeded"];

export const Job = z
    .object({
        args: z.record(z.string(), z.unknown()),
        id: z.string(),
        acquired: z.boolean(),
        created_at: z.coerce.date(),
        progress: z.int(),
        stage: z.preprocess(
            (val) => (val === "" ? null : val),
            z.string().nullable(),
        ),
        status: z.array(
            z.looseObject({ state: z.string(), timestamp: z.coerce.date() }),
        ),
        state: z.nullable(JobStateParsed),
        user: z.object({
            id: z.int(),
            handle: z.string(),
        }),
        workflow: Workflow,
    })
    .transform(({ created_at, stage, state, status, ...rest }) => ({
        ...rest,
        createdAt: created_at,
        step: stage,
        finishedAt: terminalStates.includes(state)
            ? status[status.length - 1]?.timestamp
            : undefined,
        state,
        steps: status
            .filter((s) => s.state === "running")
            .map((s) => JobStep.parse(s)),
    }));

export type ServerJob = z.input<typeof Job>;
export type Job = z.infer<typeof Job>;

export type JobCounts = {
    [state in JobState]?: { [key: string]: number | null };
};

export type JobSearchResult = SearchResult & {
    counts: JobCounts;

    /** Gives information about each job */
    documents: Array<JobMinimal>;
};
