export enum WorkflowState {
    COMPLETE = "complete",
    PENDING = "pending",
    NONE = "none",
    INCOMPATIBLE = "incompatible",
}

export type SampleWorkflows = {
    aodp: WorkflowState;
    nuvs: WorkflowState;
    pathoscope: WorkflowState;
};
