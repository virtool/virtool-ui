import { usePathParams } from "@app/hooks";
import { getWorkflowDisplayName } from "@app/utils";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import ViewHeaderTitleBadge from "@base/ViewHeaderTitleBadge";
import React from "react";
import styled from "styled-components";
import { useFetchJob } from "../queries";
import JobArgs from "./JobArgs";
import JobError from "./JobError";
import JobSteps from "./JobSteps";

const JobDetailBadge = styled(ViewHeaderTitleBadge)`
    text-transform: capitalize;
`;

/**
 * The job detailed view
 */
export default function JobDetail() {
    const { jobId } = usePathParams<{ jobId: string }>();
    const { data, isPending, isError } = useFetchJob(jobId);

    if (isError) {
        return <NotFound />;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const latest = data.status[data.status.length - 1];

    let color: "blue" | "green" | "red" = "green";

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
                    <JobDetailBadge color={color}>
                        {latest.state}
                    </JobDetailBadge>
                </ViewHeaderTitle>
                <ViewHeaderAttribution
                    time={data.status[0].timestamp}
                    user={data.user.handle}
                />
            </ViewHeader>

            <JobArgs workflow={data.workflow} args={data.args} />
            <JobSteps status={data.status} />
            <JobError error={latest.error} />
        </ContainerNarrow>
    );
}
