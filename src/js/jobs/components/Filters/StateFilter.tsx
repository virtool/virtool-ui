import { useUrlSearchParamsList } from "@utils/hooks";
import { difference, union, xor } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { SidebarHeader, SideBarSection } from "../../../base";
import { getJobCounts, getJobCountsByState } from "../../selectors";
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

export function StateFilter({ counts, test }) {
    const [states, setStates] = useUrlSearchParamsList("state");

    function handleClick(value) {
        setStates(
            value === "active" || value === "inactive" ? filterStatesByCategory(value, states) : xor(states, [value]),
        );
    }
    console.log(test);
    return (
        <StyledStatusFilter>
            <SidebarHeader>State</SidebarHeader>
            <StateCategory
                label="Active"
                states={[
                    {
                        active: states.includes("waiting"),
                        color: "grey",
                        count: counts.waiting,
                        state: "waiting",
                        label: "waiting",
                    },
                    {
                        active: states.includes("preparing"),
                        count: counts.preparing,
                        state: "preparing",
                        label: "preparing",
                        color: "grey",
                    },
                    {
                        active: states.includes("running"),
                        count: counts.running,
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
                        count: counts.complete,
                        state: "complete",
                        label: "complete",
                        color: "green",
                    },
                    {
                        active: states.includes("cancelled"),
                        count: counts.cancelled,
                        state: "cancelled",
                        label: "cancelled",
                        color: "red",
                    },
                    {
                        active: states.includes("error"),
                        count: counts.error,
                        state: "error",
                        label: "errored",
                        color: "red",
                    },
                    {
                        active: states.includes("terminated"),
                        count: counts.terminated,
                        state: "terminated",
                        label: "terminated",
                        color: "red",
                    },
                    {
                        active: states.includes("timeout"),
                        count: counts.timeout,
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

export const mapStateToProps = state => ({
    counts: getJobCountsByState(state),
    test: getJobCounts(state),
});

export default connect(mapStateToProps)(StateFilter);
