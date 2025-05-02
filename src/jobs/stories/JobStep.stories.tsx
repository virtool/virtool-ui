import { JobState } from "../types";
import type { Meta } from "@storybook/react";
import React from "react";
import { JobStep } from "../components/JobStep";

const meta: Meta<typeof JobStep> = {
    title: "jobs/Step",
    component: JobStep,
};

export default meta;

const timeElapsed = Date.now();
const today = new Date(timeElapsed);

export function Running() {
    const steps = [
        {
            state: JobState.waiting,
            step_description: null,
            step_name: null,
            timestamp: today.toDateString(),
            progress: 0,
        },
        {
            state: JobState.preparing,
            step_description: null,
            step_name: null,
            timestamp: today.toDateString(),
            progress: 0,
        },
        {
            state: JobState.running,
            step_description: "Doing something complex with numbers.",
            step_name: "Reticulate splines",
            timestamp: today.toDateString(),
            progress: 50,
        },
        {
            state: JobState.timeout,
            step_description: null,
            step_name: null,
            timestamp: today.toDateString(),
            progress: 20,
        },
        {
            state: JobState.cancelled,
            step_description: null,
            step_name: null,
            timestamp: today.toDateString(),
            progress: 40,
        },
        {
            state: JobState.error,
            step_description: null,
            step_name: null,
            timestamp: today.toDateString(),
            progress: 80,
        },
        {
            state: JobState.terminated,
            step_description: null,
            step_name: null,
            timestamp: today.toDateString(),
            progress: 60,
        },
    ];

    return (
        <>
            {steps.map((step, index) => (
                <JobStep key={index} complete={false} step={step} />
            ))}
            <JobStep key="complete" complete step={steps[2]} />
        </>
    );
}
