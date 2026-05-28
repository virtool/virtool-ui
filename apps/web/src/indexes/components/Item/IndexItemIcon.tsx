import ProgressCircle from "@base/ProgressCircle";
import type { JobState } from "@jobs/types";
import { CircleCheck } from "lucide-react";

type IndexItemIconProps = {
	activeId: string;
	id: string;
	ready: boolean;
	progress?: number;
	state?: JobState;
};

/**
 * Icon indicating that status of the index
 *
 * @param activeId - The id of the active index
 * @param id - The id of the index
 * @param ready - Whether the index is ready
 * @param progress - The progress of the building job
 * @param state - The state of the building job
 * @returns The index item's icon
 */
export function IndexItemIcon({
	activeId,
	id,
	ready,
	progress,
	state,
}: IndexItemIconProps) {
	if (ready && id !== activeId) {
		return null;
	}

	return (
		<div className="flex items-center justify-end gap-1.5">
			{ready ? (
				<CircleCheck className="stroke-green-600" size={18} />
			) : (
				<ProgressCircle
					progress={progress ?? 0}
					state={state ?? "pending"}
					size="md"
				/>
			)}
			<span className="font-medium">{ready ? "Active" : "Building"}</span>
		</div>
	);
}
