import { getFontSize, getFontWeight, sizes } from "@app/theme";
import { getWorkflowDisplayName } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import JobStateIcon from "@jobs/components/JobStateIcon";
import { JobState, Workflow } from "@jobs/types";
import { UserNested } from "@users/types";
import styled from "styled-components";

type JobStatusProps = {
    /** The progress of the job */
    progress: number;

    /** The state of the job */
    state: JobState;
};

/**
 * Displays status of job shown in the job item
 */
function JobStatus({ state, progress }: JobStatusProps) {
    return (
        <>
            <span className="capitalize">{state}</span>
            {state === "succeeded" ? (
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

export type JobItemProps = {
    /** The job id */
    id: string;

    /** When the job was created */
    createdAt: Date;

    /** The progress of the job */
    progress: number;

    /** The state of the job */
    state: JobState;

    /** The user who created the job */
    user: UserNested;

    /** The workflow of the job */
    workflow: Workflow;
};

/**
 * A condensed job item for use in a list of jobs
 */
export default function JobItem({
    id,
    createdAt,
    progress,
    state,
    user,
    workflow,
}: JobItemProps) {
    return (
        <StyledJobItem>
            <JobLink to={`/jobs/${id}`}>
                {getWorkflowDisplayName(workflow)}
            </JobLink>
            <Attribution time={createdAt} user={user.handle} />
            <JobItemHeaderRight>
                <JobStatus state={state} progress={progress} />
            </JobItemHeaderRight>
        </StyledJobItem>
    );
}
