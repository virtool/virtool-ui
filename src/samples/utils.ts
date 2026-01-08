import { JobNested } from "@jobs/types";
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
    return job.state === "failed" || job.state == "cancelled";
}
