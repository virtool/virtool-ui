import React from "react";
import { match } from "react-router-dom";
import { ContainerNarrow, LoadingPlaceholder, NoneFoundBox, Pagination } from "../../base";
import { useListHmms } from "../../hmm/queries";
import { useFetchSample } from "../../samples/queries";
import { useUrlSearchParams } from "../../utils/hooks";
import { useListAnalyses } from "../queries";
import { AnalysisMinimal } from "../types";
import AnalysisItem from "./AnalysisItem";
import AnalysesToolbar from "./AnalysisToolbar";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";

function renderRow(sampleId: string) {
    return function (document: AnalysisMinimal) {
        return <AnalysisItem key={document.id} analysis={document} sampleId={sampleId} />;
    };
}

type AnalysisListProps = {
    /** Match object containing path information */
    match: match<{ sampleId: string }>;
};

/**
 * A list of analyses with filtering options
 */
export default function AnalysesList({ match }: AnalysisListProps) {
    const sampleId = match.params.sampleId;
    const [urlPage] = useUrlSearchParams<number>("page");
    const [term, setTerm] = useUrlSearchParams<string>("find");
    const { data: analyses, isLoading: isLoadingAnalyses } = useListAnalyses(sampleId, Number(urlPage) || 1, 25);
    const { data: hmms, isLoading: isLoadingHmms } = useListHmms(1, 25);
    const { isLoading: isLoadingSample } = useFetchSample(sampleId);

    if (isLoadingAnalyses || isLoadingHmms || isLoadingSample) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <AnalysisHMMAlert installed={hmms.status.task?.complete} />
            <AnalysesToolbar onChange={e => setTerm(e.target.value)} sampleId={sampleId} term={term} />

            {analyses.found_count ? (
                <Pagination
                    items={analyses.documents}
                    renderRow={renderRow(sampleId)}
                    storedPage={analyses.page}
                    currentPage={Number(urlPage) || 1}
                    pageCount={analyses.page_count}
                />
            ) : (
                <NoneFoundBox noun="analyses" />
            )}

            <CreateAnalysis hmms={hmms} sampleId={sampleId} />
        </ContainerNarrow>
    );
}
