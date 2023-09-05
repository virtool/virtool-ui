import React from "react";
import { JobStep } from "../components/Step";

export default {
    title: "jobs/Step",
    component: JobStep,
};

export const Running = () => {
    const steps = [
        { state: "waiting", step_description: null, step_name: null, timestamp: Date.now() },
        { state: "preparing", step_description: null, step_name: null, timestamp: Date.now() },
        {
            state: "running",
            step_description: "Doing something complex with numbers.",
            step_name: "Reticulate splines",
            timestamp: Date.now(),
        },
        {
            state: "timeout",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
        },
        {
            state: "cancelled",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
        },
        {
            state: "error",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
        },
        {
            state: "terminated",
            step_description: null,
            step_name: null,
            timestamp: Date.now(),
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
};
