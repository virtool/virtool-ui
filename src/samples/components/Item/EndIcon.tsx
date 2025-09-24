import { cn } from "@/app/utils";
import IconButton from "@base/IconButton";
import ProgressCircle from "@base/ProgressCircle";
import { JobMinimal, JobState } from "@jobs/types";
import React from "react";

interface SampleItemEndIconProps {
    /** Callback to handle click event */
    onClick: () => void;
    /** Whether the sample is ready */
    ready: boolean;
    /** The job responsible for creating the sample */
    job: JobMinimal;
    /** Additional class names */
    className?: string;
}

/**
 * Icon indicating the status of sample
 */
export default function SampleItemEndIcon({
    onClick,
    ready,
    job,
    className,
}: SampleItemEndIconProps) {
    const containerClasses = cn(
        "flex items-center justify-center ml-auto [&_strong]:ml-1",
        className,
    );

    if (ready || job?.state === "complete") {
        return (
            <div className={containerClasses}>
                <IconButton
                    className="text-lg"
                    color="green"
                    name="chart-area"
                    tip="quick analyze"
                    tipPlacement="left"
                    onClick={onClick}
                />
            </div>
        );
    }
    return (
        <div className={containerClasses}>
            <ProgressCircle
                progress={job?.progress || 0}
                state={job?.state || JobState.waiting}
            />
            <strong>Creating</strong>
        </div>
    );
}
