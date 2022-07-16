import { map } from "lodash";
import { reduce, xor } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { SidebarHeader, SideBarSection } from "../../../base";
import { updateJobsSearch } from "../../actions";
import { getFromURL, getJobStateCounts } from "../../selectors";
import { StateTag } from "./StateTag";

const StatusFilterSideBarSection = styled(SideBarSection)`
    align-item: center;
    width: 320px;
    height: 250px;
    margin-left: 15px;
    i.fas {
        margin-right: 5px;
    }
`;

const StatusFilterSidebarBody = styled.div`
    display: flex;
    flex-wrap: wrap;

    & > span:not(first-child) {
        margin-left: 10px;
    }
    & > span {
        margin-top: 7px;
    }
`;

const validJobStates = ["running", "preparing", "waiting", "complete", "error", "failed", "terminated"];

export const StatusFilter = ({ allCounts, jobStates, onUpdateJobStateFilter }) => {
    const jobStatesCounts = reduce(
        validJobStates,
        (result, state) => {
            result[state] = allCounts[state] || 0;
            return result;
        },
        {}
    );

    const stateTags = map(jobStatesCounts, (count, state) => {
        return (
            <StateTag
                counts={count}
                name={state}
                key={state}
                active={jobStates.includes(state)}
                onClick={() => {
                    onUpdateJobStateFilter(xor(jobStates, [state]));
                }}
            />
        );
    });

    return (
        <StatusFilterSideBarSection>
            <SidebarHeader>Filter jobs</SidebarHeader>
            <StatusFilterSidebarBody>{stateTags}</StatusFilterSidebarBody>
        </StatusFilterSideBarSection>
    );
};

export const mapStateToProps = state => ({
    allCounts: getJobStateCounts(state),
    jobStates: getFromURL("state", state)
});

export const mapDispatchToProps = dispatch => ({
    onUpdateJobStateFilter: states => dispatch(updateJobsSearch({ states }))
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusFilter);
