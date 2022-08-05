import { map } from "lodash-es";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Box, LoadingPlaceholder, NarrowContainer, ViewHeader, ViewHeaderTitle } from "../../base";
import { checkAdminOrPermission } from "../../utils/utils";
import { findJobs } from "../actions";
import Job from "./Item/Item";
import { JobFilters } from "./Filters/Filters";
import { getJobCountsTotal } from "../selectors";
import { getFontWeight } from "../../app/theme";

const JobsListViewContainer = styled.div`
    display: flex;
    gap: ${props => props.theme.gap.column};
    justify-content: start;
`;

const JobsListEmpty = styled(Box)`
    align-items: center;
    color: ${props => props.theme.color.greyDark};
    display: flex;
    justify-content: center;
    height: 100%;

    h3 {
        font-weight: ${getFontWeight("thick")};
    }
`;

export const JobsList = ({ canArchive, canCancel, jobs, noJobs, onFind }) => {
    useEffect(() => onFind(["preparing", "running"]), []);

    if (jobs === null) {
        return <LoadingPlaceholder />;
    }

    let inner;

    if (noJobs) {
        inner = (
            <JobsListEmpty>
                <h3>No jobs found</h3>
            </JobsListEmpty>
        );
    } else if (jobs.length === 0) {
        inner = (
            <JobsListEmpty>
                <h3>No jobs matching filters</h3>
            </JobsListEmpty>
        );
    } else {
        inner = map(jobs, job => <Job key={job.id} {...job} canArchive={canArchive} canCancel={canCancel} />);
    }

    return (
        <>
            <ViewHeader title="Jobs">
                <ViewHeaderTitle>Jobs</ViewHeaderTitle>
            </ViewHeader>
            <JobsListViewContainer>
                <NarrowContainer>{inner}</NarrowContainer>
                <JobFilters />
            </JobsListViewContainer>
        </>
    );
};

export const mapStateToProps = state => ({
    jobs: state.jobs.documents,
    noJobs: getJobCountsTotal(state) === 0,
    canCancel: checkAdminOrPermission(state, "cancel_job"),
    canArchive: checkAdminOrPermission(state, "remove_job")
});

export const mapDispatchToProps = dispatch => ({
    onFind: states => {
        dispatch(findJobs(states));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsList);
