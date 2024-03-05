import React from "react";
import styled from "styled-components";
import { Icon } from "../../../base";
import { ProgressCircle } from "../../../base/ProgressCircle";
import { JobMinimal } from "../../../jobs/types";

const StyledSampleItemEndIcon = styled.div`
    align-items: center;
    background: none;
    bottom: 0;
    display: flex;
    justify-content: center;
    margin-left: auto;

    strong {
        margin-left: 5px;
    }
`;

interface SampleItemEndIconProps {
    /** Callback to handle click event */
    onClick: () => void;
    /** Whether the sample is ready */
    ready: boolean;
    /** The job responsible for creating the sample */
    job: JobMinimal;
}

/**
 * Icon indicating the status of sample
 */
export function SampleItemEndIcon({ onClick, ready, job }: SampleItemEndIconProps) {
    if (ready || job?.state === "complete") {
        return (
            <StyledSampleItemEndIcon>
                <Icon
                    color="green"
                    name="chart-area"
                    style={{ fontSize: "17px" }}
                    tip="Quick Analyze"
                    tipPlacement="left"
                    onClick={onClick}
                />
            </StyledSampleItemEndIcon>
        );
    }
    return (
        <StyledSampleItemEndIcon>
            <ProgressCircle progress={job?.progress || 0} state={job?.state || "waiting"} />
            <strong>Creating</strong>
        </StyledSampleItemEndIcon>
    );
}

export default SampleItemEndIcon;
