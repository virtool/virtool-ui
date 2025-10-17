import { JobMinimal, JobState } from "@jobs/types";
import { LibraryType } from "./types";

export const WorkflowStates = {
    NONE: "none",
    PENDING: "pending",
    READY: "ready",
};

const libraryTypes = {
    normal: "Normal",
    srna: "sRNA",
    amplicon: "Amplicon",
};

const DELETABLE_JOB_STATES = [
    JobState.cancelled,
    JobState.error,
    JobState.terminated,
    JobState.timeout,
];

export function getLibraryTypeDisplayName(libraryType: LibraryType) {
    return libraryTypes[libraryType];
}

/**
 * Check if a sample can be deleted based on its state
 */
export function checkCanDeleteSample(
    ready: boolean,
    job?: JobMinimal,
): boolean {
    if (ready) {
        return true;
    }
    return job ? DELETABLE_JOB_STATES.includes(job.state) : false;
}
