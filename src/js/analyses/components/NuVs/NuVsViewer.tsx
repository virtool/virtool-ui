import { NuVsList } from "@/analyses/components/NuVs/NuVsList";
import { FormattedNuVsAnalysis } from "@/analyses/types";
import { Sample } from "@samples/types";
import React from "react";
import NuVsExport from "./NuVsExport";
import NuVsToolbar from "./NuVsToolbar";

type NuVsViewerProps = {
    /** Complete NuVs analysis details */
    detail: FormattedNuVsAnalysis;
    /** The sample that was analysed */
    sample: Sample;
};

/**
 * Detailed breakdown of the results of a NuVs analysis
 */
export default function NuVsViewer({ detail, sample }: NuVsViewerProps) {
    return (
        <div>
            <NuVsExport analysisId={detail.id} results={detail.results} sampleName={sample.name} />
            <NuVsToolbar />
            <NuVsList detail={detail} />
        </div>
    );
}
