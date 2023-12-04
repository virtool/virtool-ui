import { map, sortBy } from "lodash-es";
import React from "react";
import { connect } from "react-redux";
import { ContainerNarrow, LoadingPlaceholder, NoneFoundBox } from "../../base";
import { useListHmms } from "../../hmm/querys";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";
import AnalysisItem from "./Item";
import AnalysesToolbar from "./Toolbar";

interface AnalysesListProps {
    analyses: any[];
}

function AnalysesList({ analyses }: AnalysesListProps) {
    const { data: hmms, isLoading: isLoadingHmms } = useListHmms(1, 25);

    if (isLoadingHmms) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <AnalysisHMMAlert installed={hmms.status.task.complete} />
            <AnalysesToolbar />

            {analyses.length ? (
                map(sortBy(analyses, "created_at").reverse(), document => (
                    <AnalysisItem key={document.id} {...document} />
                ))
            ) : (
                <NoneFoundBox noun="analyses" />
            )}

            <CreateAnalysis hmms={hmms} />
        </ContainerNarrow>
    );
}

function mapStateToProps(state) {
    return {
        analyses: state.analyses.documents,
    };
}

export default connect(mapStateToProps)(AnalysesList);
