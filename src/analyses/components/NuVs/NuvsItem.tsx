import { useUrlSearchParam } from "../../../app/hooks";
import NuvsValues from "./NuVsValues";
import { AnalysisViewerItem } from "../Viewer/Item";
import { FormattedNuvsHit } from "../../types";
import Badge from "../../../base/Badge";
import numbro from "numbro";
import React from "react";

type NuVsItemProps = {
    hit: FormattedNuvsHit;
};

/**
 * A condensed NuVs item for use in a list of NuVs
 */
export default function NuvsItem({ hit }: NuVsItemProps) {
    const { setValue: setActiveHit } = useUrlSearchParam<string>("activeHit");

    const { annotatedOrfCount, e, id, index, sequence } = hit;

    return (
        <AnalysisViewerItem onClick={() => setActiveHit(String(id))}>
            <div className="flex items-center justify-between">
                <span className="font-medium">Sequence {index}</span>
                <Badge>{sequence.length}</Badge>
            </div>

            <NuvsValues e={numbro(e).format()} orfCount={annotatedOrfCount} />
        </AnalysisViewerItem>
    );
}
