import React from "react";
import styled from "styled-components";
import { Label } from "../../../labels/types";
import LabelFilter from "./LabelFilter";
import WorkflowFilter from "./WorkflowFilter";

const StyledSampleFilters = styled.div`
    grid-column: 2;
    grid-row: 2;
`;

type LabelFilterProps = {
    /** A list of labels */
    labels: Label[];
    /** Handles click event when label is clicked */
    onClick: (value: string) => void;
    /** A list of selected labels */
    selectedLabels: string[];
};

/**
 * Filter samples by labels and workflows
 */
export function SampleFilters({ labels, onClick, selectedLabels }: LabelFilterProps) {
    return (
        <StyledSampleFilters>
            <LabelFilter labels={labels} onClick={onClick} selected={selectedLabels} />
            <WorkflowFilter />
        </StyledSampleFilters>
    );
}
