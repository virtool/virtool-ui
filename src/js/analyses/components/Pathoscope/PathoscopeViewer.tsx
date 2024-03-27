import { PathoscopeViewerScroller } from "@/analyses/components/Pathoscope/PathoscopeViewScroller";
import { FormattedPathoscopeAnalysis } from "@/analyses/types";
import { Sample } from "@samples/types";
import React from "react";
import { AnalysisMapping } from "./AnalysisMapping";
import { PathoscopeList } from "./PathoscopeList";
import { PathoscopeToolbar } from "./PathoscopeToolbar";

type PathoscopeViewerProps = {
    /** Complete pathoscope analysis details */
    detail: FormattedPathoscopeAnalysis;
    /** The sample that was analysed */
    sample: Sample;
};

/** Detailed breakdown of the results of a pathoscope analysis */
export function PathoscopeViewer({ detail, sample }: PathoscopeViewerProps) {
    return (
        <>
            <AnalysisMapping detail={detail} totalReads={sample.quality.count} />
            <PathoscopeToolbar analysisId={detail.id} />
            <PathoscopeList detail={detail} sample={sample} />
            <PathoscopeViewerScroller />
        </>
    );
}
