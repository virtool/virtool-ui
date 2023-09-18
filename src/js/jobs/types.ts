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

/* Ping information of job */
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
    /* Stage description for job */
    stage?: string | null;
    /* Current state of job */
    state: JobState;
    /* Description of current step */
    step_description?: string | null;
    /* Name of current step */
    step_name?: string | null;
    timestamp: Date;
};

export type Job = JobMinimal & {
    /* Indicates whether job has been acquired */
    acquired: boolean;
    /*  */
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
