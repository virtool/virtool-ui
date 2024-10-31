import { SidebarHeader, SideBarSection } from "@base";
import { JobCounts } from "@jobs/types";
import { useListSearchParam } from "@utils/hooks";
import { difference, union, xor } from "lodash-es";
import { mapValues, reduce } from "lodash-es/lodash";
import React from "react";
import styled from "styled-components";
import { StateCategory } from "./StateCategory";

const active = ["waiting", "preparing", "running"];
const inactive = ["complete", "cancelled", "error", "terminated", "timeout"];

function filterStatesByCategory(category, selected) {
    const options = category === "active" ? active : inactive;
    const diff = difference(selected, options);

    if (selected.length - difference(selected, options).length === options.length) {
        return diff;
    }

    return union(selected, options);
}

const StyledStatusFilter = styled(SideBarSection)`
    align-items: center;
    width: 320px;
    margin: 0;
    position: relative;
    z-index: 0;
`;

type StateFilterProps = {
    counts: JobCounts;
};

/**
 * Displays the categories of state filtering for jobs
 */
export default function StateFilter({ counts }: StateFilterProps) {
    const { values: states, setValues: setStates } = useListSearchParam("state");
    const availableCounts = mapValues(counts, workflowCounts =>
        reduce(workflowCounts, (result, value) => (result += value), 0),
    );

    function handleClick(value) {
        setStates(
            value === "active" || value === "inactive" ? filterStatesByCategory(value, states) : xor(states, [value]),
        );
    }

    return (
        <StyledStatusFilter>
            <SidebarHeader>State</SidebarHeader>
            <StateCategory
                label="Active"
                states={[
                    {
                        active: states.includes("waiting"),
                        color: "grey",
                        count: availableCounts.waiting,
                        state: "waiting",
                        label: "waiting",
                    },
                    {
                        active: states.includes("preparing"),
                        count: availableCounts.preparing,
                        state: "preparing",
                        label: "preparing",
                        color: "grey",
                    },
                    {
                        active: states.includes("running"),
                        count: availableCounts.running,
                        state: "running",
                        label: "running",
                        color: "blue",
                    },
                ]}
                onClick={handleClick}
            />
            <StateCategory
                label="Inactive"
                states={[
                    {
                        active: states.includes("complete"),
                        count: availableCounts.complete,
                        state: "complete",
                        label: "complete",
                        color: "green",
                    },
                    {
                        active: states.includes("cancelled"),
                        count: availableCounts.cancelled,
                        state: "cancelled",
                        label: "cancelled",
                        color: "red",
                    },
                    {
                        active: states.includes("error"),
                        count: availableCounts.error,
                        state: "error",
                        label: "errored",
                        color: "red",
                    },
                    {
                        active: states.includes("terminated"),
                        count: availableCounts.terminated,
                        state: "terminated",
                        label: "terminated",
                        color: "red",
                    },
                    {
                        active: states.includes("timeout"),
                        count: availableCounts.timeout,
                        state: "timeout",
                        label: "timed out",
                        color: "red",
                    },
                ]}
                onClick={handleClick}
            />
        </StyledStatusFilter>
    );
}
