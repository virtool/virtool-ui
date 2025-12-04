import Alert from "@/base/Alert";
import RelativeTime, { useRelativeTime } from "@/base/RelativeTime";
import { usePathParams } from "@app/hooks";
import { getWorkflowDisplayName } from "@app/utils";
import ContainerNarrow from "@base/ContainerNarrow";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NotFound from "@base/NotFound";
import ViewHeader from "@base/ViewHeader";
import ViewHeaderAttribution from "@base/ViewHeaderAttribution";
import ViewHeaderTitle from "@base/ViewHeaderTitle";
import { useFetchJob } from "../queries";
import type { JobState } from "../types";
import JobArgs from "./JobArgs";
import JobSteps from "./JobSteps";

function getAlertColor(
    state: JobState,
): "blue" | "green" | "orange" | "red" | "purple" {
    switch (state) {
        case "failed":
            return "red";
        case "pending":
            return "purple";
        case "running":
            return "green";
        case "succeeded":
            return "blue";
    }
}

function PendingJobAlert({ createdAt }: { createdAt: Date }) {
    const pendingTime = useRelativeTime(createdAt, { addSuffix: false });

    return (
        <Alert color="purple">
            <div>
                <div>Job pending for {pendingTime}.</div>
                <div className="mt-1">
                    The job is waiting for an available runner.
                </div>
            </div>
        </Alert>
    );
}
/**
 * The job detailed view
 */
export default function JobDetail() {
    const { jobId } = usePathParams<{ jobId: string }>();
    const { data, isPending, error } = useFetchJob(jobId);

    if (error) {
        if ("status" in error && error.status === 404) {
            return <NotFound />;
        }
        throw error;
    }

    if (isPending) {
        return <LoadingPlaceholder />;
    }

    const color = getAlertColor(data.state);
    const workflow = getWorkflowDisplayName(data.workflow);

    return (
        <ContainerNarrow>
            <ViewHeader title={workflow}>
                <ViewHeaderTitle>{workflow}</ViewHeaderTitle>
                <ViewHeaderAttribution
                    time={data.createdAt}
                    user={data.user.handle}
                />
            </ViewHeader>
            <JobArgs workflow={data.workflow} args={data.args} />
            {data.state === "pending" ? (
                <PendingJobAlert createdAt={data.createdAt} />
            ) : (
                <Alert color={color}>
                    Job {data.state}
                    {data.finishedAt && (
                        <>
                            &nbsp;
                            <RelativeTime time={data.finishedAt} />
                        </>
                    )}
                </Alert>
            )}
            <JobSteps state={data.state} steps={data.steps} />
        </ContainerNarrow>
    );
}
