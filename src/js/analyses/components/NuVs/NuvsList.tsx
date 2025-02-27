import NuvsItem from "@/analyses/components/NuVs/NuvsItem";
import AnalysisViewerList from "@/analyses/components/Viewer/AnalysisViewerList";
import { useSortAndFilterNuVsHits } from "@/analyses/hooks";
import { FormattedNuvsAnalysis } from "@/analyses/types";
import NuvsDetail from "@analyses/components/NuVs/NuvsDetail";
import { map } from "lodash";
import React from "react";

type NuVsListProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuvsAnalysis;
};

/**
 * Displays a list of NuVs hits with a detailed view
 */
export function NuvsList({ detail }: NuVsListProps) {
    const sortedHits = useSortAndFilterNuVsHits(detail);

    return (
        <div className="flex gap-4">
            <AnalysisViewerList
                matches={sortedHits}
                total={detail.results.hits.length}
                itemSize={58}
                width={230}
            >
                {map(sortedHits, (hit) => (
                    <NuvsItem key={hit.id} hit={hit} />
                ))}
            </AnalysisViewerList>
            <NuvsDetail
                analysisId={detail.id}
                matches={sortedHits}
                maxSequenceLength={detail.maxSequenceLength}
            />
        </div>
    );
}
