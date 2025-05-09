import { usePageParam, usePathParams } from "@app/hooks";
import ContainerNarrow from "@base/ContainerNarrow";
import LinkButton from "@base/LinkButton";
import LoadingPlaceholder from "@base/LoadingPlaceholder";
import NoneFoundBox from "@base/NoneFoundBox";
import Pagination from "@base/Pagination";
import { useListHmms } from "@hmm/queries";
import { useCheckCanEditSample } from "@samples/hooks";
import { useFetchSample } from "@samples/queries";
import React from "react";
import { useListAnalyses } from "../queries";
import { AnalysisMinimal } from "../types";
import AnalysisItem from "./AnalysisItem";
import CreateAnalysis from "./Create/CreateAnalysis";
import AnalysisHMMAlert from "./HMMAlert";

function renderRow() {
    return function (document: AnalysisMinimal) {
        return <AnalysisItem key={document.id} analysis={document} />;
    };
}

/**
 * A list of analyses with filtering options
 */
export default function AnalysesList() {
    const { sampleId } = usePathParams<{ sampleId: string }>();
    const { page } = usePageParam();
    const { data: analyses, isPending: isPendingAnalyses } = useListAnalyses(
        sampleId,
        page,
        25,
    );
    const { data: hmms, isPending: isPendingHmms } = useListHmms(1, 25);
    const { isPending: isPendingSample } = useFetchSample(sampleId);
    const { hasPermission: canCreate } = useCheckCanEditSample(sampleId);

    if (isPendingAnalyses || isPendingHmms || isPendingSample) {
        return <LoadingPlaceholder />;
    }

    return (
        <ContainerNarrow>
            <AnalysisHMMAlert installed={hmms.status.task?.complete} />
            <div className="flex justify-end pb-4">
                {canCreate && (
                    <LinkButton color="blue" to="?openCreateAnalysis=true">
                        Create
                    </LinkButton>
                )}
            </div>
            {analyses.found_count ? (
                <Pagination
                    items={analyses.documents}
                    renderRow={renderRow()}
                    storedPage={analyses.page}
                    currentPage={page}
                    pageCount={analyses.page_count}
                />
            ) : (
                <NoneFoundBox noun="analyses" />
            )}

            <CreateAnalysis hmms={hmms} sampleId={sampleId} />
        </ContainerNarrow>
    );
}
