/**
 * Sample Types
 *
 * @remark
 * Types in this file represent the data returned from the API, or are useful for working
 * with sample data.
 */

/**
 * All workflow states.
 */
export enum WorkflowState {
    COMPLETE = "complete",
    PENDING = "pending",
    NONE = "none",
    INCOMPATIBLE = "incompatible",
}

/**
 * All workflow states for a sample.
 */
export type SampleWorkflows = {
    aodp: WorkflowState;
    nuvs: WorkflowState;
    pathoscope: WorkflowState;
};
