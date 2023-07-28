/**
 * Sample Types
 *
 * @remark
 * Types in this file represent the data returned from the API, or are useful for working
 * with sample data.
 */

/**
 * Collection of all workflow states that can be associated with a sample.
 */
export enum WorkflowState {
    COMPLETE = "complete",
    PENDING = "pending",
    NONE = "none",
    INCOMPATIBLE = "incompatible",
}

/**
 * Collection of all types of workflows and their state associated with a sample
 */
export type SampleWorkflows = {
    aodp: WorkflowState;
    nuvs: WorkflowState;
    pathoscope: WorkflowState;
};
