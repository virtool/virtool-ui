import BoxGroup from "@base/BoxGroup";
import { map } from "lodash-es";
import { JobStatus } from "../types";
import JobStep from "./JobStep";

type JobStepsProps = {
    /** The list of status's the job has had */
    status: JobStatus[];
};

/**
 * A list showing the steps that a job has gone through.
 */
export default function JobSteps({ status }: JobStepsProps) {
    const currentIndex = status.length - 1;

    const stepComponents = map(status, (step, index) => (
        <JobStep key={index} complete={index < currentIndex} step={step} />
    ));

    return <BoxGroup>{stepComponents}</BoxGroup>;
}
