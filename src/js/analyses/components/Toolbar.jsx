import React from "react";
import { connect } from "react-redux";
import { pushState } from "../../app/actions";
import { Button, InputSearch, Toolbar } from "../../base";
import { getCanModify } from "../../samples/selectors";
import { findAnalyses } from "../actions";

export const AnalysesToolbar = ({ canModify, onFind, onShowCreate, page, sampleId, term }) => (
    <Toolbar>
        <InputSearch value={term} onChange={e => onFind(sampleId, e.target.value, page)} />
        <Button
            icon="plus-square fa-fw"
            tip="New Analysis"
            color="blue"
            onClick={() => onShowCreate(sampleId)}
            disabled={!canModify}
        />
    </Toolbar>
);

export const mapStateToProps = state => ({
    canModify: getCanModify(state),
    page: state.analyses.page,
    sampleId: state.samples.detail.id,
    term: state.analyses.term
});

export const mapDispatchToProps = dispatch => ({
    onFind: (sampleId, term, page) => {
        dispatch(findAnalyses(sampleId, term, page));
    },
    onShowCreate: sampleId => {
        dispatch(pushState({ createAnalysis: sampleId }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AnalysesToolbar);
