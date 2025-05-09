import { sizes } from "@app/theme";
import Icon from "@base/Icon";
import ProgressCircle from "@base/ProgressCircle";
import { JobMinimal, JobState } from "@jobs/types";
import React from "react";

type IndexItemIconProps = {
    activeId: string;
    id: string;
    ready: boolean;
    job?: JobMinimal;
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
                <Icon name="check" color="green" />
            ) : (
                <ProgressCircle
                    progress={job?.progress || 0}
                    state={job?.state || JobState.waiting}
                    size={sizes.md}
                />
            )}
            <span className="font-medium">{ready ? "Active" : "Building"}</span>
        </div>
    );
}
