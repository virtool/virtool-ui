import React from "react";
import { connect } from "react-redux";
import { LoadingPlaceholder, NoneFoundBox, ScrollList, ViewHeader, ViewHeaderTitle } from "../../base";
import { checkAdminOrPermission } from "../../utils/utils";
import { findJobs } from "../actions";
import { getTerm } from "../selectors";
import Job from "./Item/Item";
import JobsSummary from "./Summary";
import JobsToolbar from "./Toolbar";

export class JobsList extends React.Component {
    componentDidMount() {
        this.props.onLoadNextPage(this.props.term, 1);
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

                <JobsSummary />
                <JobsToolbar />

                {noneFound}

                <ScrollList
                    documents={this.props.documents}
                    page={this.props.page}
                    pageCount={this.props.page_count}
                    onLoadNextPage={page => this.props.onLoadNextPage(this.props.term, page)}
                    renderRow={this.renderRow}
                />
            </>
        );
    }
}

export const mapStateToProps = state => ({
    ...state.jobs,
    term: getTerm(state),
    canCancel: checkAdminOrPermission(state, "cancel_job"),
    canArchive: checkAdminOrPermission(state, "remove_job")
});

export const mapDispatchToProps = dispatch => ({
    onLoadNextPage: (term, page) => {
        dispatch(findJobs(term, page));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsList);
