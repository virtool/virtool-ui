import { format } from "date-fns";
import React from "react";
import styled from "styled-components";
import { BoxGroupSection, Icon, Loader } from "../../base";
import { JobState } from "../types";
import { getStepDescription } from "../utils";
import { JobStateIcon } from "./JobStateIcon";

const JobStepLoader = styled(Loader)`
    padding: 0 1.5px;
`;

const StyledJobStepTimestamp = styled.div`
    align-items: center;
    display: flex;
    margin-top: 10px;

    i:not(:first-child) {
        padding-left: 10px;
    }

    & > span {
        padding-left: 5px;
    }
`;

interface JobStepTimestampProps {
    timestamp: string;
}

function JobStepTimestamp({ timestamp }: JobStepTimestampProps) {
    return (
        <StyledJobStepTimestamp>
            <Icon name="clock" />
            <span>{format(new Date(timestamp), "HH:mm:ss")}</span>
            <Icon name="calendar" />
            <span>{format(new Date(timestamp), "yyyy-MM-dd")}</span>
        </StyledJobStepTimestamp>
    );
}

const StyledJobStepDescription = styled.div`
    display: flex;
    flex-direction: column;

    > h4 {
        font-size: ${props => props.theme.fontSize.lg};
        font-weight: bold;
        margin: 0 0 4px;
    }

    > p {
        color: ${props => props.theme.color.greyDarkest};
        margin: 0 0 3px;
    }
`;

type JobStep = {
    state: JobState;
    step_description: string;
    step_name: string;
    timestamp: string;
};

interface JobStepDescriptionProps {
    step: JobStep;
}

function JobStepDescription({ step }: JobStepDescriptionProps) {
    const { description, title } = getStepDescription(step);

    return (
        <StyledJobStepDescription>
            <h4>{title}</h4>
            <p>{description}</p>
            <JobStepTimestamp timestamp={step.timestamp} />
        </StyledJobStepDescription>
    );
}

interface JobStepIconProps {
    complete: boolean;
    state: JobState;
}

function JobStepIcon({ complete, state }: JobStepIconProps) {
    if (complete) {
        return <Icon name="arrow-circle-down" color="blue" title={state} fixedWidth />;
    }

    if (state === "running") {
        return <JobStepLoader size="12px" color="blue" />;
    }

    return <JobStateIcon state={state} />;
}

const JobStepIconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 16px;
    margin-right: 4px;
    padding-top: 3px;
    width: 16px;
`;

const StyledJobStep = styled(BoxGroupSection)`
    align-items: flex-start;
    display: flex;
`;

interface JobStepProps {
    complete: boolean;
    step: JobStep;
}

export function JobStep({ complete, step }: JobStepProps) {
    return (
        <StyledJobStep>
            <JobStepIconContainer>
                <JobStepIcon state={step.state} complete={complete} />
            </JobStepIconContainer>
            <JobStepDescription step={step} />
        </StyledJobStep>
    );
}

StyledJobStep.displayName = "JobStep";
