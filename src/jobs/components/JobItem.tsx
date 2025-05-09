import { getFontSize, getFontWeight, sizes } from "@app/theme";
import { getWorkflowDisplayName } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import JobStateIcon from "@jobs/components/JobStateIcon";
import { JobState, workflows } from "@jobs/types";
import { getStateTitle } from "@jobs/utils";
import { UserNested } from "@users/types";
import React from "react";
import styled from "styled-components";

type JobStatusProps = {
    /** The state of the job */
    state: JobState;
    /** The progress of the job */
    progress: number;
};

/**
 * Displays status of job shown in the job item
 */
function JobStatus({ state, progress }: JobStatusProps) {
    return (
        <>
            <span>{getStateTitle(state)}</span>
            {state === "complete" ? (
                <JobStateIcon state={state} />
            ) : (
                <ProgressCircle
                    size={sizes.md}
                    state={state}
                    progress={progress}
                />
            )}
        </>
    );
}

const StyledJobItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
    font-size: ${getFontSize("lg")};
    line-height: 1;
    padding-bottom: 15px;
    padding-top: 15px;
`;

const JobLink = styled(Link)`
    font-weight: ${getFontWeight("thick")};
    min-width: 30%;
`;

const JobItemHeaderRight = styled.div`
    align-items: center;
    display: flex;
    gap: 5px;
    margin-left: auto;
    font-weight: ${getFontWeight("thick")};
`;

type JobItemProps = {
    /** The job id */
    id: string;
    /** The workflow of the job */
    workflow: workflows;
    /** The state of the job */
    state: JobState;
    /** The progress of the job */
    progress: number;
    /** When the job was created */
    created_at: string;
    /** The user who created the job */
    user: UserNested;
};

/**
 * A condensed job item for use in a list of jobs
 */
export default function JobItem({
    id,
    workflow,
    state,
    progress,
    created_at,
    user,
}: JobItemProps) {
    return (
        <StyledJobItem>
            <JobLink to={`/jobs/${id}`}>
                {getWorkflowDisplayName(workflow)}
            </JobLink>
            <Attribution time={created_at} user={user.handle} />
            <JobItemHeaderRight>
                <JobStatus state={state} progress={progress} />
            </JobItemHeaderRight>
        </StyledJobItem>
    );
}
