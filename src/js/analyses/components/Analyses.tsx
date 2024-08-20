import React from "react";
import { Route } from "react-router-dom";
import { Routes } from "react-router-dom-v5-compat";
import AnalysisDetail from "./AnalysisDetail";
import AnalysesList from "./AnalysisList";

export default function Analyses() {
    return (
        <Routes>
            <Route path="/samples/:sampleId/analyses" component={AnalysesList} exact />
            <Route path="/samples/:sampleId/analyses/:analysisId" component={AnalysisDetail} />
        </Routes>
    );
}
