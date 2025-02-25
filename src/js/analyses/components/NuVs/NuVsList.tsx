import NuVsDetail from "@/analyses/components/NuVs/NuVsDetail";
import NuVsItem from "@/analyses/components/NuVs/NuVsItem";
import AnalysisViewerList from "@/analyses/components/Viewer/AnalysisViewerList";
import { useSortAndFilterNuVsHits } from "@/analyses/hooks";
import { FormattedNuvsAnalysis } from "@/analyses/types";
import { map } from "lodash";
import React from "react";
import styled from "styled-components";

const NuVsPanes = styled.div`
    display: grid;
    grid-template-columns: 230px 1fr;
`;

type NuVsListProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuvsAnalysis;
};

/**
 * Displays a list of NuVs hits with a detailed view
 */
export function NuVsList({ detail }: NuVsListProps) {
    const sortedHits = useSortAndFilterNuVsHits(detail);

    return (
        <NuVsPanes>
            <AnalysisViewerList
                matches={sortedHits}
                total={detail.results.hits.length}
                itemSize={58}
                width={230}
            >
                {map(sortedHits, (hit) => (
                    <NuVsItem key={hit.id} hit={hit} />
                ))}
            </AnalysisViewerList>
            <NuVsDetail
                analysisId={detail.id}
                matches={sortedHits}
                maxSequenceLength={detail.maxSequenceLength}
            />
        </NuVsPanes>
    );
}
