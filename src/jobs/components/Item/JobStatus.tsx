import React from "react";
import { sizes } from "../../../app/theme";
import ProgressCircle from "../../../base/ProgressCircle";
import { JobState } from "../../types";
import { getStateTitle } from "../../utils";
import { JobStateIcon } from "../JobStateIcon";

type JobStatusProps = {
    /** The state of the job */
    state: JobState;
    /** The progress of the job */
    progress: number;
};

/**
 * Displays status of job shown in the job item
 */
export function JobStatus({ state, progress }: JobStatusProps) {
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
