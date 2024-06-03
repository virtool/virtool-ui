import React from "react";
import AnalysisViewerList from "../Viewer/AnalysisViewerList";
import AODPItem from "./Item";

export const AODPList = () => (
    <AnalysisViewerList itemSize={38} width={300}>
        {AODPItem}
    </AnalysisViewerList>
);
