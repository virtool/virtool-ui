import IconButton from "@base/IconButton";
import ProgressCircle from "@base/ProgressCircle";
import type { JobState } from "@jobs/types";
import { ChartArea } from "lucide-react";
import { cn } from "@/app/utils";

type SampleItemEndIconProps = {
	/** Progress of the job responsible for creating the sample */
	progress: number;

	/** State of the job responsible for creating the sample */
	state?: JobState;

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
	progress,
	state,
	className,
}: SampleItemEndIconProps) {
	const containerClasses = cn(
		"flex items-center justify-center ml-auto",
		className,
	);

	if (ready || state === "succeeded") {
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
			<ProgressCircle progress={progress} state={state ?? "pending"} />
			<strong className="ml-1">Creating</strong>
		</div>
	);
}
