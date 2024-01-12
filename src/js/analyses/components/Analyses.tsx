import React from "react";
import { Route, Switch } from "react-router-dom";
import AnalysesList from "./AnalysisList";
import AnalysisDetail from "./Detail";

export default function Analyses() {
    return (
        <Switch>
            <Route path="/samples/:sampleId/analyses" component={AnalysesList} exact />
            <Route path="/samples/:sampleId/analyses/:analysisId" component={AnalysisDetail} />
        </Switch>
    );
}
