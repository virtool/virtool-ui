import React from "react";
import styled from "styled-components";
import { Icon, Loader } from "../../../base";

const SampleIconContainer = styled.div`
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

/**
 * Icon indicating the status of sample
 *
 * @param ready - Whether the sample is ready
 * @param onClick - Callback to handle click event
 */
export function EndIcon({ ready, onClick }) {
    if (ready) {
        return (
            <SampleIconContainer>
                <Icon
                    color="green"
                    name="chart-area"
                    style={{ fontSize: "17px" }}
                    tip="Quick Analyze"
                    tipPlacement="left"
                    onClick={onClick}
                />
            </SampleIconContainer>
        );
    } else {
        return (
            <SampleIconContainer>
                <Loader size="14px" color="primary" />
                <strong>Creating</strong>
            </SampleIconContainer>
        );
    }
}

export default EndIcon;
