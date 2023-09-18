import { UserNested } from "../users/types";

export type JobState =
    | "complete"
    | "cancelled"
    | "error"
    | "preparing"
    | "running"
    | "terminated"
    | "timeout"
    | "waiting";

export type IconColor = "blue" | "green" | "grey" | "red" | "orange" | "purple";

export type JobNested = {
    id: string;
};

export type JobMinimal = JobNested & {
    archived: boolean;
    created_at: Date;
    progress: number;
    stage?: string;
    state: JobState;
    user: UserNested;
    workflow: string;
};

export type JobPing = {
    pinged_at: Date;
};

export type JobError = {
    /* Details of error */
    details: Array<string>;
    /* Traceback of error */
    traceback: Array<string>;
    type: string;
};

export type JobStatus = {
    /* Indicates job error if occurred */
    error?: JobError | null;
    progress: number;
    stage?: string | null;
    state: JobState;
    step_description?: string | null;
    step_name?: string | null;
    timestamp: Date;
};

export type Job = JobMinimal & {
    acquired: boolean;
    args: { [key: string]: any };
    status: Array<JobStatus>;
    ping?: JobPing;
};

export type JobSearchResult = {
    found_count: number;
    page: number;
    page_count: number;
    per_page: number;
    total_count: number;
    /* Gives information about number of jobs in each state */
    counts: {
        [state in JobState]?: {
            [key: string]: number | null;
        };
    };
    /* Gives information about each job */
    documents: Array<JobMinimal>;
};
