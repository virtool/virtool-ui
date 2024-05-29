import NuVsItem from "@/analyses/components/NuVs/NuVsItem";
import { useSortAndFilterNuVsHits } from "@/analyses/hooks";
import { FormattedNuVsAnalysis } from "@/analyses/types";
import { Accordion } from "@base";
import { map } from "lodash";
import React from "react";

type NuVsListProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuVsAnalysis;
};

/**
 * Displays a list of NuVs hits
 */
export function NuVsList({ detail }: NuVsListProps) {
    return (
        <Accordion type="single" collapsible>
            {map(useSortAndFilterNuVsHits(detail), hit => (
                <NuVsItem key={hit.id} analysisId={detail.id} hit={hit} maxSequenceLength={detail.maxSequenceLength} />
            ))}
        </Accordion>
    );
}
