import { Label } from "@labels/types";
import React from "react";
import styled from "styled-components";
import LabelFilter from "./LabelFilter";
import WorkflowFilter from "./WorkflowFilter";

const StyledSampleFilters = styled.div`
    grid-column: 2;
    grid-row: 2;
`;

type SampleFilterProps = {
    /** A list of labels */
    labels: Label[];

    /** Handles click event when label is clicked */
    onClickLabels: (value: string) => void;

    /** A list of selected labels */
    selectedLabels: string[];

    /** Handles click event when workflow is clicked */
    onClickWorkflows: (value: string[]) => void;

    /** A list of selected workflows */
    selectedWorkflows: string[];
};

/**
 * Filter samples by labels and workflows
 */
export default function SampleFilters({
    labels,
    onClickLabels,
    onClickWorkflows,
    selectedLabels,
    selectedWorkflows,
}: SampleFilterProps) {
    return (
        <StyledSampleFilters>
            <LabelFilter
                labels={labels}
                onClick={onClickLabels}
                selected={selectedLabels}
            />
            <WorkflowFilter
                selected={selectedWorkflows}
                onClick={onClickWorkflows}
            />
        </StyledSampleFilters>
    );
}
