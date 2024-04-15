import { SidebarHeader, SideBarSection } from "@base";
import { JobState } from "@jobs/types";
import { useUrlSearchParamsList } from "@utils/hooks";
import { difference, union, xor } from "lodash-es";
import { mapValues, reduce } from "lodash-es/lodash";
import React from "react";
import styled from "styled-components";
import { StateCategory } from "./StateCategory";

const active = ["waiting", "preparing", "running"];
const inactive = ["complete", "cancelled", "errored", "terminated"];

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
    counts: {
        [state in JobState]?: {
            [key: string]: number | null;
        };
    };
};

/**
 * Displays the categories of state filtering for jobs
 */
export default function StateFilter({ counts }: StateFilterProps) {
    const [states, setStates] = useUrlSearchParamsList("state");
    const count = mapValues(counts, workflowCounts => reduce(workflowCounts, (result, value) => (result += value), 0));

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
                        count: count.waiting,
                        state: "waiting",
                        label: "waiting",
                    },
                    {
                        active: states.includes("preparing"),
                        count: count.preparing,
                        state: "preparing",
                        label: "preparing",
                        color: "grey",
                    },
                    {
                        active: states.includes("running"),
                        count: count.running,
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
                        count: count.complete,
                        state: "complete",
                        label: "complete",
                        color: "green",
                    },
                    {
                        active: states.includes("cancelled"),
                        count: count.cancelled,
                        state: "cancelled",
                        label: "cancelled",
                        color: "red",
                    },
                    {
                        active: states.includes("error"),
                        count: count.error,
                        state: "error",
                        label: "errored",
                        color: "red",
                    },
                    {
                        active: states.includes("terminated"),
                        count: count.terminated,
                        state: "terminated",
                        label: "terminated",
                        color: "red",
                    },
                    {
                        active: states.includes("timeout"),
                        count: count.timeout,
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
