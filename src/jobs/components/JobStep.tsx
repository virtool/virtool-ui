import { format } from "date-fns";
import React from "react";
import styled from "styled-components";
import BoxGroupSection from "../../base/BoxGroupSection";
import Icon from "../../base/Icon";
import Loader from "../../base/Loader";
import { JobStatus } from "../types";
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

const StyledJobStepDescription = styled.div`
    display: flex;
    flex-direction: column;

    > h4 {
        font-size: ${(props) => props.theme.fontSize.lg};
        font-weight: bold;
        margin: 0 0 4px;
    }

    > p {
        color: ${(props) => props.theme.color.greyDarkest};
        margin: 0 0 3px;
    }
`;

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

type JobStepProps = {
    complete: boolean;
    step: JobStatus;
};

/**
 * A condensed job step for use in a list of job steps
 */
export function JobStep({ complete, step }: JobStepProps) {
    const { description, title } = getStepDescription(step);

    return (
        <StyledJobStep>
            <JobStepIconContainer>
                {complete ? (
                    <Icon
                        name="arrow-circle-down"
                        color="blue"
                        title={step.state}
                        fixedWidth
                    />
                ) : step.state === "running" ? (
                    <JobStepLoader size="12px" color="blue" />
                ) : (
                    <JobStateIcon state={step.state} />
                )}
            </JobStepIconContainer>

            <StyledJobStepDescription>
                <h4>{title}</h4>
                <p>{description}</p>

                <StyledJobStepTimestamp>
                    <Icon name="clock" />
                    <span>{format(new Date(step.timestamp), "HH:mm:ss")}</span>
                    <Icon name="calendar" />
                    <span>
                        {format(new Date(step.timestamp), "yyyy-MM-dd")}
                    </span>
                </StyledJobStepTimestamp>
            </StyledJobStepDescription>
        </StyledJobStep>
    );
}
