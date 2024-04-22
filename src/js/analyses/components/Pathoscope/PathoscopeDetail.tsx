import { FormattedPathoscopeHit } from "@/analyses/types";
import { ScrollSyncContext, useUrlSearchParams } from "@utils/hooks";
import { filter, map, maxBy } from "lodash-es";
import React from "react";
import { PathoscopeIsolate } from "./Isolate";

type PathoscopeDetailProps = {
    /** Complete information for a pathoscope hit */
    hit: FormattedPathoscopeHit;
    /** The total number of reads mapped to any OTU during the analysis*/
    mappedCount: number;
};

/** Detailed coverage for a single OTU hits from pathoscope analysis*/
export function PathoscopeDetail({ hit, mappedCount }: PathoscopeDetailProps) {
    const [filterIsolates] = useUrlSearchParams<boolean>("filterIsolates");
    const [showReads] = useUrlSearchParams<boolean>("reads");
    const { isolates, pi } = hit;

    const filtered = filter(isolates, isolate => !filterIsolates || isolate.pi >= 0.03 * pi);
    const graphWidth = maxBy(filtered, item => item.filled.length).filled.length;

    const isolateComponents = map(filtered, (isolate, index) => {
        const graphRatios =
            isolate.sequences.length > 1 ? isolate.sequences.map(sequence => sequence.filled.length / graphWidth) : 1;

        return (
            <PathoscopeIsolate
                key={isolate.id}
                {...isolate}
                reads={Math.round(isolate.pi * mappedCount)}
                showPathoscopeReads={showReads}
                graphWidth={graphWidth}
                graphRatios={graphRatios}
            />
        );
    });

    return (
        <div>
            <ScrollSyncContext>{isolateComponents}</ScrollSyncContext>
        </div>
    );
}
