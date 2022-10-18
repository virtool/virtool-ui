import React from "react";
import styled from "styled-components";
import { Icon, Loader } from "../../../base";

const StyledJobStatus = styled.div`
    align-items: center;
    display: flex;
    margin-left: auto;
    padding-right: ${props => (props.pad ? "30px" : 0)};

    & > *:first-child {
        margin-right: 3px;
    }

    span:last-child {
        text-transform: capitalize;
    }
`;

export const JobStatus = ({ pad, state }) => {
    if (state === "waiting" || state === "running" || state === "preparing") {
        return (
            <StyledJobStatus pad={pad}>
                <Loader size="14px" color="primary" />
                <span>{state}</span>
            </StyledJobStatus>
        );
    }

    return (
        <StyledJobStatus pad={pad}>
            <Icon
                name={`${state === "complete" ? "check" : state === "terminated" ? "skull" : "times"} fa-fw`}
                color={`${state === "complete" ? "green" : "red"}`}
            />
            <span>{state}</span>
        </StyledJobStatus>
    );
};
