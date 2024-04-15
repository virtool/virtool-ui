import { JobState } from "@jobs/types";
import React from "react";
import StateFilter from "./StateFilter";

type StateFilterProps = {
    counts: {
        [state in JobState]?: {
            [key: string]: number | null;
        };
    };
};

/**
 * Displays the state filter options for jobs
 */
export function JobFilters({ counts }: StateFilterProps) {
    return (
        <div>
            <StateFilter counts={counts} />
        </div>
    );
}
