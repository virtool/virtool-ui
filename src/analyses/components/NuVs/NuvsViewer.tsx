<<<<<<<< HEAD:src/analyses/components/NuVs/NuvsViewer.tsx
import NuvsList from "@analyses/components/NuVs/NuvsList";
import NuvsToolbar from "@analyses/components/NuVs/NuvsToolbar";
import { FormattedNuvsAnalysis } from "@analyses/types";
import { Sample } from "@samples/types";
========
>>>>>>>> main:src/analyses/components/NuVs/NuVsViewer.tsx
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
export default function NuvsViewer({ detail, sample }: NuVsViewerProps) {
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
