import type { Meta } from "@storybook/react";
import React from "react";
import { JobStep } from "../components/JobStep";

const meta: Meta<typeof JobStep> = {
    title: "jobs/Step",
    component: JobStep,
    tags: ["autodocs"],
};

export default meta;

export function Running() {
    const steps = [
        { state: "waiting", step_description: null, step_name: null, timestamp: Date.now(), progress: 0 },
        { state: "preparing", step_description: null, step_name: null, timestamp: Date.now(), progress: 0 },
        {
            state: "running",
            step_description: "Doing something complex with numbers.",
            step_name: "Reticulate splines",
            timestamp: Date.now(),
            progress: 50,
        },
        {
            state: "timeout",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
            progress: 20,
        },
        {
            state: "cancelled",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
            progress: 40,
        },
        {
            state: "error",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
            progress: 80,
        },
        {
            state: "terminated",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
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
