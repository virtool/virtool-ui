import { AnalysisViewerItem } from "@/analyses/components/Viewer/Item";
import { FormattedNuvsHit } from "@/analyses/types";
import NuvsValues from "@analyses/components/NuVs/NuVsValues";
import { Badge } from "@base";
import { useUrlSearchParam } from "@utils/hooks";
import numbro from "numbro";
import React from "react";

type NuVsItemProps = {
    hit: FormattedNuvsHit;
};

/**
 * A condensed NuVs item for use in a list of NuVs
 */
export default function NuvsItem({ hit }: NuVsItemProps) {
    const { value: activeHit, setValue: setActiveHit } =
        useUrlSearchParam<string>("activeHit");

    const { annotatedOrfCount, e, id, index, sequence } = hit;

    return (
        <AnalysisViewerItem
            active={activeHit === String(id)}
            onClick={() => setActiveHit(String(id))}
        >
            <div className="flex items-center justify-between">
                <span className="font-medium">Sequence {index}</span>
                <Badge>{sequence.length}</Badge>
            </div>

            <NuvsValues e={numbro(e).format()} orfCount={annotatedOrfCount} />
        </AnalysisViewerItem>
    );
}
