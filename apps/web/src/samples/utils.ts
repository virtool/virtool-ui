import type { JobNested } from "@jobs/types";
import type { LibraryType } from "./types";

/** The workflows that samples can be filtered by. */
export const filterableWorkflows = ["pathoscope", "nuvs"];

/** The state of a single workflow, as accepted by the sample filter API. */
export type WorkflowFilterState = "none" | "pending" | "ready";

const workflowFilterStateDisplayNames: Record<WorkflowFilterState, string> = {
	none: "Not analyzed",
	pending: "In progress",
	ready: "Complete",
};

export const workflowFilterStates = Object.keys(
	workflowFilterStateDisplayNames,
) as WorkflowFilterState[];

/**
 * Get the human-readable name of a workflow filter state.
 */
export function getWorkflowFilterStateDisplayName(
	state: WorkflowFilterState,
): string {
	return workflowFilterStateDisplayNames[state];
}

/** A sample filter selecting one state of one workflow. */
export type WorkflowFilter = {
	state: WorkflowFilterState;
	workflow: string;
};

function isWorkflowFilterState(value: string): value is WorkflowFilterState {
	return Object.hasOwn(workflowFilterStateDisplayNames, value);
}

/**
 * Encode a workflow filter as the ``workflow:state`` value used in the URL.
 */
export function formatWorkflowFilter({ state, workflow }: WorkflowFilter) {
	return `${workflow}:${state}`;
}

/**
 * Parse ``workflow:state`` filter values, discarding any that aren't recognized.
 */
export function parseWorkflowFilters(values: string[]): WorkflowFilter[] {
	return values.flatMap((value) => {
		const [workflow, state] = value.split(":");

		if (
			!workflow ||
			!state ||
			!filterableWorkflows.includes(workflow) ||
			!isWorkflowFilterState(state)
		) {
			return [];
		}

		return [{ state, workflow }];
	});
}

const libraryTypes = {
	normal: "Normal",
	srna: "sRNA",
	amplicon: "Amplicon",
};

export function getLibraryTypeDisplayName(libraryType: LibraryType) {
	return libraryTypes[libraryType];
}

/**
 * Check if a sample can be deleted based on its state
 */
export function checkCanDeleteSample(ready: boolean, job?: JobNested): boolean {
	if (ready) {
		return true;
	}
	return job?.state === "failed" || job?.state === "cancelled";
}
