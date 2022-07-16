import React from "react";
import { connect } from "react-redux";
import { SearchInput, Toolbar } from "../../base";

import { updateJobsSearch } from "../actions";
import { getTermFromURL } from "../selectors";

export const JobsToolbar = ({ onUpdateJobsSearch, term }) => (
    <Toolbar>
        <SearchInput value={term} onChange={onUpdateJobsSearch} placeholder="User or workflow" />
    </Toolbar>
);

export const mapStateToProps = state => ({
    term: getTermFromURL(state)
});

export const mapDispatchToProps = dispatch => ({
    onUpdateJobsSearch: e => {
        dispatch(updateJobsSearch({ find: e.target.value }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(JobsToolbar);
