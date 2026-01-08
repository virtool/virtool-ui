import { sizes } from "@app/theme";
import ProgressCircle from "@base/ProgressCircle";
import { JobNested } from "@jobs/types";
import { CircleCheck } from "lucide-react";

type IndexItemIconProps = {
    activeId: string;
    id: string;
    ready: boolean;
    job?: JobNested;
};

/**
 * Icon indicating that status of the index
 *
 * @param activeId - The id of the active index
 * @param id - The id of the index
 * @param ready - Whether the index is ready
 * @param job - The related job object
 * @returns The index item's icon
 */
export function IndexItemIcon({
    activeId,
    id,
    ready,
    job,
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
                    progress={job?.progress || 0}
                    state={job?.state || "pending"}
                    size={sizes.md}
                />
            )}
            <span className="font-medium">{ready ? "Active" : "Building"}</span>
        </div>
    );
}
