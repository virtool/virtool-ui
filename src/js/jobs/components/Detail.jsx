import { push } from "connected-react-router";
import { get } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { checkAdminRoleOrPermission } from "../../administration/utils";
import {
    Badge,
    ContainerNarrow,
    LoadingPlaceholder,
    NotFound,
    ViewHeader,
    ViewHeaderAttribution,
    ViewHeaderTitle,
} from "../../base";
import { Permission } from "../../groups/types";
import { getWorkflowDisplayName } from "../../utils/utils";
import { archiveJob, cancelJob, getJob } from "../actions";
import JobError from "./Error";
import { JobArgs } from "./JobArgs";
import JobSteps from "./Steps";

const JobDetailBadge = styled(Badge)`
    text-transform: capitalize;
`;

class JobDetail extends React.Component {
    componentDidMount() {
        this.props.getDetail(this.props.match.params.jobId);
    }

    handleClick = () => {
        this.props.onRemove(this.props.detail.id);
    };

    render() {
        if (this.props.error) {
            return <NotFound />;
        }

        if (this.props.detail === null) {
            return <LoadingPlaceholder />;
        }
        const detail = this.props.detail;

        const latest = detail.status[detail.status.length - 1];

        let color = "green";

        if (latest.state === "running") {
            color = "blue";
        }

        if (
            latest.state === "error" ||
            latest.state === "cancelled" ||
            latest.state === "timeout" ||
            latest.state === "terminated"
        ) {
            color = "red";
        }

        const workflow = getWorkflowDisplayName(detail.workflow);

        return (
            <ContainerNarrow>
                <ViewHeader title={workflow}>
                    <ViewHeaderTitle>
                        {workflow}
                        <JobDetailBadge color={color}>{latest.state}</JobDetailBadge>
                    </ViewHeaderTitle>
                    <ViewHeaderAttribution time={detail.status[0].timestamp} user={detail.user.handle} />
                </ViewHeader>

                <JobArgs workflow={detail.workflow} args={detail.args} />

                <JobSteps />

                <JobError error={latest.error} />
            </ContainerNarrow>
        );
    }
}

function mapStateToProps(state) {
    return {
        error: get(state, "errors.GET_JOB_ERROR", null),
        detail: state.jobs.detail,
        canCancel: checkAdminRoleOrPermission(state, Permission.cancel_job),
        canArchive: checkAdminRoleOrPermission(state, Permission.remove_job),
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getDetail: jobId => {
            dispatch(getJob(jobId));
        },
        onCancel: jobId => {
            dispatch(cancelJob(jobId));
        },
        onArchive: jobId => {
            dispatch(archiveJob(jobId));
            dispatch(push("/jobs"));
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(JobDetail);
