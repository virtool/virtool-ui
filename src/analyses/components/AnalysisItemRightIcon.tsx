import IconButton from "@base/IconButton";
import React from "react";

type AnalysisItemRightIconProps = {
    /** Whether the user has permission to remove an analysis */
    canModify: boolean;
    /** A callback function to handle the removal of an analysis */
    onRemove: () => void;
};

/**
 * Displays icon for removing an analysis
 */
export function AnalysisItemRightIcon({
    canModify,
    onRemove,
}: AnalysisItemRightIconProps) {
    return canModify ? (
        <IconButton name="trash" color="red" tip="remove" onClick={onRemove} />
    ) : null;
}
