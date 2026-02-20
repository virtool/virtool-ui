import { cn } from "@/app/utils";
import IconButton from "@base/IconButton";
import ProgressCircle from "@base/ProgressCircle";
import { JobNested } from "@jobs/types";
import { ChartArea } from "lucide-react";

type SampleItemEndIconProps = {
    /** The job responsible for creating the sample */
    job: JobNested;

    /** Callback to handle click event */
    onClick: () => void;

    /** Whether the sample is ready */
    ready: boolean;

    /** Additional class names */
    className?: string;
};

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

    if (ready || job?.state === "succeeded") {
        return (
            <div className={containerClasses}>
                <IconButton
                    className="text-lg"
                    color="green"
                    IconComponent={ChartArea}
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
                state={job?.state || "pending"}
            />
            <strong>Creating</strong>
        </div>
    );
}
