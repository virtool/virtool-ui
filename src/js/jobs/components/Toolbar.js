import React from "react";
import { connect } from "react-redux";
import { SearchInput, Toolbar } from "../../base";
import { findJobs } from "../actions";

export const JobsToolbar = ({ onFind, term }) => (
    <Toolbar>
        <SearchInput value={term} onChange={onFind} placeholder="User or workflow" />
    </Toolbar>
);

export const mapStateToProps = state => ({
    term: state.jobs.term
});

export const mapDispatchToProps = dispatch => ({
    onFind: e => {
        dispatch(findJobs(e.target.value, 1));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsToolbar);
