import { sizes } from "@app/theme";
import { getWorkflowDisplayName } from "@app/utils";
import Attribution from "@base/Attribution";
import BoxGroupSection from "@base/BoxGroupSection";
import Link from "@base/Link";
import ProgressCircle from "@base/ProgressCircle";
import JobStateIcon from "@jobs/components/JobStateIcon";
import { JobState, Workflow } from "@jobs/types";
import { UserNested } from "@users/types";

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
        <BoxGroupSection className="grid grid-cols-3 text-lg">
            <Link className="col-span-1 font-medium" to={`/jobs/${id}`}>
                {getWorkflowDisplayName(workflow)}
            </Link>
            <Attribution
                className="col-span-1"
                time={createdAt}
                user={user.handle}
            />
            <div className="col-span-1 flex font-medium gap-1 items-center justify-end">
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
            </div>
        </BoxGroupSection>
    );
}
