import { useListHmms } from "@/hmm/queries";
import { ContainerNarrow, LoadingPlaceholder, NoneFoundBox, Pagination } from "@base";
import { useFetchSample } from "@samples/queries";
import { useUrlSearchParams } from "@utils/hooks";
import React from "react";
import { useParams } from "wouter";
import { useListAnalyses } from "../queries";
import { AnalysisMinimal } from "../types";
import AnalysisItem from "./AnalysisItem";
import AnalysesToolbar from "./AnalysisToolbar";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";

function renderRow(sampleId: string) {
    return function (document: AnalysisMinimal) {
        return <AnalysisItem key={document.id} analysis={document} />;
    };
}

/**
 * A list of analyses with filtering options
 */
export default function AnalysesList() {
    const { sampleId } = useParams();
    const [urlPage] = useUrlSearchParams("page");
    const { data: analyses, isPending: isPendingAnalyses } = useListAnalyses(sampleId, Number(urlPage) || 1, 25);
    const { data: hmms, isPending: isPendingHmms } = useListHmms(1, 25);
    const { isPending: isPendingSample } = useFetchSample(sampleId);

    if (isPendingAnalyses || isPendingHmms || isPendingSample) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <AnalysisHMMAlert installed={hmms.status.task?.complete} />
            <AnalysesToolbar sampleId={sampleId} />

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
