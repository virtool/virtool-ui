export type IconColor = "blue" | "green" | "grey" | "red" | "orange" | "purple";

export type JobState =
    | "complete"
    | "cancelled"
    | "error"
    | "preparing"
    | "running"
    | "terminated"
    | "timeout"
    | "waiting";
