import { isEqual } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { LoadingPlaceholder, NarrowContainer, NoneFoundBox, ScrollList, ViewHeader, ViewHeaderTitle } from "../../base";
import { checkAdminOrPermission } from "../../utils/utils";
import { findJobs, updateJobsSearch } from "../actions";
import { getFromURL, getTermFromURL } from "../selectors";
import StatusFilter from "./filter/StatusFilter";
import Job from "./Item/Item";
import JobsToolbar from "./Toolbar";

const JobsListViewContainer = styled.div`
    display: flex;
    justify-content: start;
`;

export class JobsList extends React.Component {
    componentDidMount() {
        if (!this.props.jobStates.length) {
            this.props.onUpdateJobStateFilter(["preparing", "running"]);
        }
        this.props.onLoadNextPage(1);
    }

    componentDidUpdate(prevProps) {
        if (!isEqual(prevProps.jobStates, this.props.jobStates) || prevProps.term !== this.props.term) {
            this.props.onLoadNextPage(1);
        }
    }

    renderRow = index => {
        const document = this.props.documents[index];
        return (
            <Job key={document.id} {...document} canArchive={this.props.canArchive} canCancel={this.props.canCancel} />
        );
    };

    render() {
        if (this.props.documents === null) {
            return <LoadingPlaceholder />;
        }

        let noneFound;

        if (!this.props.documents.length) {
            noneFound = <NoneFoundBox noun="jobs" />;
        }

        return (
            <>
                <ViewHeader title="Jobs">
                    <ViewHeaderTitle>Jobs</ViewHeaderTitle>
                </ViewHeader>
                <JobsListViewContainer>
                    <NarrowContainer>
                        <JobsToolbar />

                        {noneFound}

                        <ScrollList
                            documents={this.props.documents}
                            page={this.props.page}
                            pageCount={this.props.page_count}
                            onLoadNextPage={page => this.props.onLoadNextPage(page)}
                            renderRow={this.renderRow}
                        />
                    </NarrowContainer>
                    <StatusFilter />
                </JobsListViewContainer>
            </>
        );
    }
}

export const mapStateToProps = state => ({
    ...state.jobs,
    term: getTermFromURL(state),
    canCancel: checkAdminOrPermission(state, "cancel_job"),
    canArchive: checkAdminOrPermission(state, "remove_job"),
    jobStates: getFromURL("state", state)
});

export const mapDispatchToProps = dispatch => ({
    onLoadNextPage: page => {
        dispatch(findJobs(page));
    },
    onUpdateJobStateFilter: states => dispatch(updateJobsSearch({ states }))
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsList);
