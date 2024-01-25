import React, { useCallback } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { getFontSize, getFontWeight } from "../../../app/theme";
import { Attribution, Box, ProgressBarAffixed } from "../../../base";
import { getWorkflowDisplayName } from "../../../utils/utils";
import { archiveJob, cancelJob } from "../../actions";
import { JobAction } from "./Action";
import { JobStatus } from "./Status";

const JobItemHeader = styled.div`
    align-items: center;
    display: flex;
    font-weight: ${getFontWeight("thick")};
    margin-bottom: 5px;
`;

const JobItemHeaderRight = styled.div`
    align-items: center;
    display: flex;
    gap: 5px;
    margin-left: auto;
`;

const StyledJobItem = styled(Box)`
    font-size: ${getFontSize("lg")};
    padding-top: 15px;

    ${Attribution} {
        font-size: ${getFontSize("md")};
    }
`;

export function JobItem({
    id,
    workflow,
    state,
    progress,
    created_at,
    user,
    canCancel,
    canArchive,
    onCancel,
    onArchive,
}) {
    const handleCancel = useCallback(() => onCancel(id), [id, onCancel]);
    const handleArchive = useCallback(() => onArchive(id), [id, onArchive]);

    let progressColor = "green";

    if (state === "running") {
        progressColor = "blue";
    }

    if (state === "error" || state === "cancelled" || state === "timeout" || state === "terminated") {
        progressColor = "red";
    }

    return (
        <StyledJobItem>
            <ProgressBarAffixed now={progress} color={progressColor} />
            <JobItemHeader>
                <Link to={`/jobs/${id}`}>{getWorkflowDisplayName(workflow)}</Link>
                <JobItemHeaderRight>
                    <JobStatus state={state} pad={canCancel || canArchive} />
                    <JobAction
                        key={state}
                        state={state}
                        canCancel={canCancel}
                        canArchive={canArchive}
                        onCancel={handleCancel}
                        onArchive={handleArchive}
                    />
                </JobItemHeaderRight>
            </JobItemHeader>
            <Attribution time={created_at} user={user.handle} />
        </StyledJobItem>
    );
}

export const mapDispatchToProps = dispatch => ({
    onCancel: jobId => {
        dispatch(cancelJob(jobId));
    },

    onArchive: jobId => {
        dispatch(archiveJob(jobId));
    },
});

export default connect(null, mapDispatchToProps)(JobItem);
