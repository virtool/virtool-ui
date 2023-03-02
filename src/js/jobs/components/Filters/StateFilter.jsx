import { difference, union, xor } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { SidebarHeader, SideBarSection } from "../../../base";
import { findJobs } from "../../actions";
import { getJobCountsByState, getStatesFromURL } from "../../selectors";
import { StateCategory } from "./StateCategory";

const active = ["waiting", "preparing", "running"];
const inactive = ["complete", "cancelled", "errored", "terminated"];

const filterStatesByCategory = (category, selected) => {
    const options = category === "active" ? active : inactive;

    const diff = difference(selected, options);

    if (selected.length - difference(selected, options).length === options.length) {
        return diff;
    }

    return union(selected, options);
};

const StyledStatusFilter = styled(SideBarSection)`
    align-items: center;
    width: 320px;
    margin: 0;
    position: relative;
    z-index: 0;
`;

export const StateFilter = ({ counts, states, onUpdateJobStateFilter }) => {
    const handleClick = value =>
        onUpdateJobStateFilter(
            value === "active" || value === "inactive" ? filterStatesByCategory(value, states) : xor(states, [value])
        );

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
                        label: "waiting"
                    },
                    {
                        active: states.includes("preparing"),
                        count: counts.preparing,
                        state: "preparing",
                        label: "preparing",
                        color: "grey"
                    },
                    {
                        active: states.includes("running"),
                        count: counts.running,
                        state: "running",
                        label: "running",
                        color: "blue"
                    }
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
                        color: "green"
                    },
                    {
                        active: states.includes("cancelled"),
                        count: counts.cancelled,
                        state: "cancelled",
                        label: "cancelled",
                        color: "red"
                    },
                    {
                        active: states.includes("error"),
                        count: counts.error,
                        state: "error",
                        label: "errored",
                        color: "red"
                    },
                    {
                        active: states.includes("terminated"),
                        count: counts.terminated,
                        state: "terminated",
                        label: "terminated",
                        color: "red"
                    },
                    {
                        active: states.includes("timeout"),
                        count: counts.terminated,
                        state: "timeout",
                        label: "timeout",
                        color: "red"
                    }
                ]}
                onClick={handleClick}
            />
        </StyledStatusFilter>
    );
};

export const mapStateToProps = state => ({
    counts: getJobCountsByState(state),
    states: getStatesFromURL(state)
});

export const mapDispatchToProps = dispatch => ({
    onUpdateJobStateFilter: states => {
        dispatch(findJobs(states));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StateFilter);
