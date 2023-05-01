import { map, sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { ContainerNarrow, NoneFoundBox } from "../../base";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";
import AnalysisItem from "./Item";
import AnalysesToolbar from "./Toolbar";

interface AnalysesListProps {
    analyses: any[];
}

function AnalysesList({ analyses }: AnalysesListProps) {
    return (
        <ContainerNarrow>
            <AnalysisHMMAlert />
            <AnalysesToolbar />

            {analyses.length ? (
                map(sortBy(analyses, "created_at").reverse(), document => (
                    <AnalysisItem key={document.id} {...document} />
                ))
            ) : (
                <NoneFoundBox noun="analyses" />
            )}

            <CreateAnalysis />
        </ContainerNarrow>
    );
}

function mapStateToProps(state) {
    return {
        analyses: state.analyses.documents,
    };
}

export default connect(mapStateToProps)(AnalysesList);
