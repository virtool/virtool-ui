import { PathoscopeViewerScroller } from "@/analyses/components/Pathoscope/PathoscopeViewScroller";
import { FormattedPathoscopeAnalysis } from "@/analyses/types";
import { Alert } from "@/base";
import { useUrlSearchParam } from "@/hooks";
import { Sample } from "@samples/types";
import React from "react";
import { PathoscopeList } from "./PathoscopeList";
import { AnalysisMapping } from "./PathoscopeMapping";
import { PathoscopeToolbar } from "./PathoscopeToolbar";

type PathoscopeViewerProps = {
    /** Complete pathoscope analysis details */
    detail: FormattedPathoscopeAnalysis;
    /** The sample that was analysed */
    sample: Sample;
};

/** Detailed breakdown of the results of a pathoscope analysis */
export function PathoscopeViewer({ detail, sample }: PathoscopeViewerProps) {
    const { value: showReads } = useUrlSearchParam<boolean>("reads");

    return (
        <>
            <AnalysisMapping
                detail={detail}
                totalReads={sample.quality.count}
            />
            <PathoscopeToolbar analysisId={detail.id} />
            {showReads && (
                <Alert color="orange" level>
                    <div>
                        <p className="font-bold">
                            Read Numbers are not realistic.
                        </p>
                        <p>
                            Read numbers are arbitrarily calculated using weight
                            × total mapped reads and are not representative of
                            actual numbers of reads mapped to viruses.
                        </p>
                        <p>Read numbers are shown only for continuity.</p>
                    </div>
                </Alert>
            )}
            <PathoscopeList detail={detail} sample={sample} />
            <PathoscopeViewerScroller />
        </>
    );
}
