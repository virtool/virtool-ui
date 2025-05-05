import React from "react";
import { JobCounts } from "../../types";
import StateFilter from "./StateFilter";

type StateFilterProps = {
    counts: JobCounts;
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
