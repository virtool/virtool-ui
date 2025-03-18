import { LibraryType } from "@samples/types";

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
