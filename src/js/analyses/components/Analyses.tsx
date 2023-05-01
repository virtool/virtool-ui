import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import { findHmms } from "../../hmm/actions";
import { listReadyIndexes } from "../../indexes/actions";

import { LoadingPlaceholder } from "../../base";
import { findAnalyses } from "../actions";
import AnalysisDetail from "./Detail";
import AnalysesList from "./List";

interface AnalysesProps {
    loading: boolean;
    onFindAnalyses: (sampleId: string) => void;
    onFindHmms: () => void;
    onListReadyIndexes: () => void;
}

function Analyses({ loading, onFindAnalyses, onFindHmms, onListReadyIndexes }: AnalysesProps) {
    const sampleId = useRouteMatch().params.sampleId;

    useEffect(() => {
        onFindAnalyses(sampleId);
        onFindHmms();
        onListReadyIndexes();
    }, [sampleId]);

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
        loading:
            state.analyses.documents === null || state.hmms.documents === null || state.analyses.readyIndexes === null
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onFindAnalyses: sampleId => {
            dispatch(findAnalyses(sampleId, "", 1));
        },
        onFindHmms: () => {
            dispatch(findHmms());
        },
        onListReadyIndexes: () => {
            dispatch(listReadyIndexes());
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Analyses);
