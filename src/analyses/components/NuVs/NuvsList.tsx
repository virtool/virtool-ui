import { map } from "lodash";
import React from "react";
import { useSortAndFilterNuVsHits } from "../../hooks";
import { FormattedNuvsAnalysis } from "../../types";
import AnalysisViewerList from "../Viewer/AnalysisViewerList";
import NuvsDetail from "./NuvsDetail";
import NuvsItem from "./NuvsItem";

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
