import React from "react";
import styled from "styled-components";
import { Icon, Loader } from "../../../base";

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
}

/**
 * Icon indicating the status of sample
 */
export function SampleItemEndIcon({ onClick, ready }: SampleItemEndIconProps) {
    if (ready) {
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
            <Loader size="14px" color="primary" />
            <strong>Creating</strong>
        </StyledSampleItemEndIcon>
    );
}

export default SampleItemEndIcon;
