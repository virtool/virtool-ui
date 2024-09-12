import React from "react";
import { Route, Switch } from "wouter";
import AnalysisDetail from "./AnalysisDetail";
import AnalysesList from "./AnalysisList";

export default function Analyses() {
    return (
        <Switch>
            <Route path="/:analysisId" component={AnalysisDetail} nest />
            <Route path="/" component={AnalysesList} nest />
        </Switch>
    );
}
