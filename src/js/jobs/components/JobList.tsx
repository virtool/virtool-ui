import React, { useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getFontWeight } from "../../app/theme";
import {
    Box,
    BoxGroup,
    ContainerNarrow,
    LegacyScrollList,
    LoadingPlaceholder,
    ViewHeader,
    ViewHeaderTitle,
} from "../../base";
import { findJobs } from "../actions";
import { getJobCountsTotal } from "../selectors";
import { JobMinimal } from "../types";
import { JobFilters } from "./Filters/Filters";
import Job from "./Item/JobItem";

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

const StyledLegacyScrollList = styled(LegacyScrollList)`
    margin-bottom: 0;
`;

const initialState = ["preparing", "running"];

type JobListProps = {
    /** A list of jobs */
    jobs: JobMinimal[];
    /** Indicates whether there are no jobs available */
    noJobs: boolean;
    /** A callback function to load the next page of data */
    onLoadNextPage: (states: string[], page: number) => void;
    /** The current page number */
    page: number;
    /** The total number of pages */
    page_count: number;
    /** The job states */
    states: string[];
};

/**
 * A list of jobs with filtering options
 */
export function JobsList({ jobs, noJobs, onLoadNextPage, page, page_count, states }: JobListProps) {
    useEffect(() => {
        onLoadNextPage(states?.length ? states : initialState, 1);
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
            <BoxGroup>
                <StyledLegacyScrollList
                    documents={jobs}
                    page={page}
                    pageCount={page_count}
                    onLoadNextPage={page => onLoadNextPage(states, page)}
                    renderRow={index => {
                        const job = jobs[index];
                        return <Job key={job.id} {...job} />;
                    }}
                />
            </BoxGroup>
        );
    }

    return (
        <>
            <ViewHeader title="Jobs">
                <ViewHeaderTitle>Jobs</ViewHeaderTitle>
            </ViewHeader>
            <JobsListViewContainer>
                <ContainerNarrow>{inner}</ContainerNarrow>
                <JobFilters />
            </JobsListViewContainer>
        </>
    );
}

export const mapStateToProps = state => ({
    page: state.jobs.page,
    page_count: state.jobs.page_count,
    states: new URLSearchParams(state.router.location.search).getAll("state"),
    jobs: state.jobs.documents,
    noJobs: getJobCountsTotal(state) === 0,
});

export const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (states, page) => {
        dispatch(findJobs(states, page));
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsList);
