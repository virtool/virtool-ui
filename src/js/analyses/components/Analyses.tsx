import React from "react";
import { Route, Switch } from "react-router-dom";
import AnalysisDetail from "./AnalysisDetail";
import AnalysesList from "./AnalysisList";

export default function Analyses() {
    return (
        <Switch>
            <Route path="/samples/:sampleId/analyses" component={AnalysesList} exact />
            <Route path="/samples/:sampleId/analyses/:analysisId" component={AnalysisDetail} />
        </Switch>
    );
}
