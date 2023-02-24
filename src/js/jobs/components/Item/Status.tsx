import React from "react";
import { Loader } from "../../../base";
import { JobState } from "../../types";
import { getStateTitle } from "../../utils";
import { JobStateIcon } from "../JobStateIcon";

interface JobStatusProps {
    pad?: boolean;
    state: JobState;
}

export function JobStatus({ state }: JobStatusProps) {
    if (state === "running" || state === "preparing") {
        return (
            <>
                <Loader size="14px" color="blue" />
                <span>{getStateTitle(state)}</span>
            </>
        );
    }

    return (
        <>
            <JobStateIcon state={state} />
            <span>{getStateTitle(state)}</span>
        </>
    );
}
