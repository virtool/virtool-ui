import {
    Badge,
    ContainerNarrow,
    LoadingPlaceholder,
    NotFound,
    ViewHeader,
    ViewHeaderAttribution,
    ViewHeaderTitle,
} from "@base";
import { useFetchJob } from "@jobs/queries";
import { getWorkflowDisplayName } from "@utils/utils";
import React from "react";
import { match } from "react-router-dom";
import styled from "styled-components";
import { JobArgs } from "./JobArgs";
import JobError from "./JobError";
import JobSteps from "./JobSteps";

const JobDetailBadge = styled(Badge)`
    text-transform: capitalize;
`;

type JobDetailProps = {
    /** Match object containing path information */
    match: match<{ jobId: string }>;
};

/**
 * The job detailed view
 */
export default function JobDetail({ match }: JobDetailProps) {
    const { data, isLoading, isError } = useFetchJob(match.params.jobId);

    if (isError) {
        return <NotFound />;
    }

    if (isLoading) {
        return <LoadingPlaceholder />;
    }

    const latest = data.status[data.status.length - 1];

    let color: "blue" | "green" | "red" | "orange" | "purple" = "green";

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

    const workflow = getWorkflowDisplayName(data.workflow);

    return (
        <ContainerNarrow>
            <ViewHeader title={workflow}>
                <ViewHeaderTitle>
                    {workflow}
                    <JobDetailBadge color={color}>{latest.state}</JobDetailBadge>
                </ViewHeaderTitle>
                <ViewHeaderAttribution time={data.status[0].timestamp} user={data.user.handle} />
            </ViewHeader>

            <JobArgs workflow={data.workflow} args={data.args} />
            <JobSteps status={data.status} />
            <JobError error={latest.error} />
        </ContainerNarrow>
    );
}
