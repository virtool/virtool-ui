import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontWeight } from "../../app/theme";
import { Box, LoadingPlaceholder, NarrowContainer, ScrollList, ViewHeader, ViewHeaderTitle } from "../../base";
import { checkAdminOrPermission } from "../../utils/utils";
import { findJobs } from "../actions";
import { getJobCountsTotal } from "../selectors";
import { JobFilters } from "./Filters/Filters";
import Job from "./Item/Item";

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

export const JobsList = ({ canArchive, canCancel, jobs, noJobs, onLoadNextPage, page, page_count, states }) => {
    const initialStates = ["preparing", "running"];

    useEffect(() => {
        if (!states?.length) {
            onLoadNextPage(initialStates, 1);
        } else {
            onLoadNextPage(states, 1);
        }
    }, []);

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
        inner = (
            <ScrollList
                documents={jobs}
                page={page}
                pageCount={page_count}
                onLoadNextPage={page => onLoadNextPage(states, page)}
                renderRow={index => {
                    const job = jobs[index];
                    return <Job key={job.id} {...job} canArchive={canArchive} canCancel={canCancel} />;
                }}
            />
        );
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
    page: state.jobs.page,
    page_count: state.jobs.page_count,
    states: new URLSearchParams(state.router.location.search).getAll("state"),
    jobs: state.jobs.documents,
    noJobs: getJobCountsTotal(state) === 0,
    canCancel: checkAdminOrPermission(state, "cancel_job"),
    canArchive: checkAdminOrPermission(state, "remove_job")
});

export const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (states, page) => {
        dispatch(findJobs(states, page));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsList);
