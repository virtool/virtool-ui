import React from "react";
import styled from "styled-components";
import { Icon } from "../../base";

const TrashIcon = styled(Icon)`
    display: flex;
    justify-content: center;
    width: 20px;
    height: 20px;
`;

type AnalysisItemRightIconProps = {
    /** Whether the user has permission to remove an analysis */
    canModify: boolean;
    /** A callback function to handle the removal of an analysis */
    onRemove: () => void;
};

/**
 * Displays icon for removing an analysis
 */
export function AnalysisItemRightIcon({ canModify, onRemove }: AnalysisItemRightIconProps) {
    return canModify ? <TrashIcon name="trash" color="red" onClick={onRemove} style={{ fontSize: "17px" }} /> : null;
}
