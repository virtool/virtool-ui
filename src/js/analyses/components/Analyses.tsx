import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { LoadingPlaceholder } from "../../base";
import { listReadyIndexes } from "../../indexes/actions";
import AnalysisDetail from "./AnalysisDetail";
import AnalysesList from "./AnalysisList";

function Analyses({ loading, onListReadyIndexes }) {
    useEffect(() => {
        onListReadyIndexes();
    }, []);

    if (loading) {
        return <LoadingPlaceholder />;
    }

    return (
        <Switch>
            <Route path="/samples/:sampleId/analyses" component={AnalysesList} exact />
            <Route path="/samples/:sampleId/analyses/:analysisId" component={AnalysisDetail} />
        </Switch>
    );
}

function mapStateToProps(state) {
    return {
        loading: state.analyses.readyIndexes === null,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onListReadyIndexes: () => {
            dispatch(listReadyIndexes());
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analyses);
