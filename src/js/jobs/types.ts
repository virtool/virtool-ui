import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

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

/* A Job with essential information */
export type JobNested = {
    id: string;
};

/* Minimal Job used for websocket messages and resource listings */
export type JobMinimal = JobNested & {
    archived: boolean;
    /** The iso formatted date of creation */
    created_at: string;
    progress: number;
    stage?: string;
    state: JobState;
    user: UserNested;
    workflow: string;
};

/* Provides information on when a Job was pinged */
export type JobPing = {
    pinged_at: Date;
};

/* Provides Job error information */
export type JobError = {
    details: Array<string>;
    traceback: Array<string>;
    type: string;
};

/* Provides Job Status information */
export type JobStatus = {
    error?: JobError | null;
    progress: number;
    /* Stage description for job */
    stage?: string | null;
    state: JobState;
    step_description?: string | null;
    step_name?: string | null;
    timestamp: Date;
};

/* A complete Job */
export type Job = JobMinimal & {
    acquired: boolean;
    /* Provides information on subtraction and the related files */
    args: { [key: string]: any };
    /* Array containing status history of job */
    status: Array<JobStatus>;
    ping?: JobPing;
};

/* Job search results from the API */
export type JobSearchResult = SearchResult & {
    /* Gives information about number of jobs in each state */
    counts: {
        [state in JobState]?: {
            [key: string]: number | null;
        };
    };
    /* Gives information about each job */
    documents: Array<JobMinimal>;
};
