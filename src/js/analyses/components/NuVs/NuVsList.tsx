import NuVsDetail from "@/analyses/components/NuVs/NuVsDetail";
import NuVsItem from "@/analyses/components/NuVs/NuVsItem";
import AnalysisViewerList from "@/analyses/components/Viewer/List";
import { useSortAndFilterNuVsHits } from "@/analyses/hooks";
import { FormattedNuVsAnalysis } from "@/analyses/types";
import { map } from "lodash";
import React from "react";
import styled from "styled-components";

const NuVsPanes = styled.div`
    display: grid;
    grid-template-columns: 230px 1fr;
`;

type NuVsListProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuVsAnalysis;
};

/**
 * Displays a list of NuVs hits
 */
export function NuVsList({ detail }: NuVsListProps) {
    const sortedHits = useSortAndFilterNuVsHits(detail);
    console.log(sortedHits);

    return (
        <NuVsPanes>
            <AnalysisViewerList matches={sortedHits} total={detail.results.hits.length} itemSize={58} width={230}>
                {map(sortedHits, hit => (
                    <NuVsItem key={hit.id} hit={hit} />
                ))}
            </AnalysisViewerList>
            <NuVsDetail analysisId={detail.id} matches={sortedHits} maxSequenceLength={detail.maxSequenceLength} />
        </NuVsPanes>
    );
}
