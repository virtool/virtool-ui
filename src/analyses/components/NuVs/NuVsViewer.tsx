import React from "react";
import { Sample } from "../../../samples/types";
import { FormattedNuvsAnalysis } from "../../types";
import { NuvsList } from "./NuvsList";
import NuvsToolbar from "./NuvsToolbar";

type NuVsViewerProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuvsAnalysis;
    /** The sample that was analysed */
    sample: Sample;
};

/**
 * Detailed breakdown of the results of a NuVs analysis
 */
export default function NuVsViewer({ detail, sample }: NuVsViewerProps) {
    return (
        <div>
            <NuvsToolbar
                analysisId={detail.id}
                results={detail.results}
                sampleName={sample.name}
            />
            <NuvsList detail={detail} />
        </div>
    );
}
