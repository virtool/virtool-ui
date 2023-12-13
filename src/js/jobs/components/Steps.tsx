import { map } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { BoxGroup } from "../../base";
import { JobStatus } from "../types";
import { JobStep } from "./Step";

/**
 * A list showing the steps that a job has gone through.
 *
 * @param status - The list of status's the job has had
 * @returns A list of steps
 */
export function JobSteps({ status }: { status: JobStatus[] }) {
    const currentIndex = status.length - 1;

    const stepComponents = map(status, (step, index) => (
        <JobStep key={index} complete={index < currentIndex} step={step} />
    ));

    return <BoxGroup>{stepComponents}</BoxGroup>;
}

export function mapStateToProps(state) {
    return {
        status: state.jobs.detail?.status,
    };
}

export default connect(mapStateToProps)(JobSteps);
