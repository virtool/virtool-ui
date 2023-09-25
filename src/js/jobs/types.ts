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
    /** The iso formatted date of creation */
    created_at: string;
    progress: number;
    stage?: string;
    state: JobState;
    user: UserNested;
    workflow: string;
};
