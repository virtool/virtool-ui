import { getFontSize, getFontWeight } from "@app/theme";
import { Attribution, BoxGroupSection, Link } from "@base";
import { UserNested } from "@users/types";
import { getWorkflowDisplayName } from "@utils/utils";
import React from "react";
import styled from "styled-components";
import { JobState, workflows } from "../../types";
import { JobStatus } from "./JobStatus";

const StyledJobItem = styled(BoxGroupSection)`
    align-items: center;
    display: flex;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: ${getFontSize("lg")};
    line-height: 1;

    ${Attribution} {
        font-size: ${getFontSize("md")};
    }
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
export default function JobItem({ id, workflow, state, progress, created_at, user }: JobItemProps) {
    return (
        <StyledJobItem>
            <JobLink to={`/jobs/${id}`}>{getWorkflowDisplayName(workflow)}</JobLink>
            <Attribution time={created_at} user={user.handle} />
            <JobItemHeaderRight>
                <JobStatus state={state} progress={progress} />
            </JobItemHeaderRight>
        </StyledJobItem>
    );
}
