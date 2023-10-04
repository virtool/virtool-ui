import React from "react";
import styled from "styled-components";
import { sizes } from "../../../app/theme";
import { Icon } from "../../../base";
import { ProgressCircle } from "../../../base/ProgressCircle";

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

export function EndIcon({ ready, job, onClick }) {
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
                <ProgressCircle progress={job?.progress || 0} state={job?.state || "waiting"} size={sizes.md} />
                <strong>Creating</strong>
            </SampleIconContainer>
        );
    }
}

export default EndIcon;
