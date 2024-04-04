import { FormattedPathoscopeHit } from "@/analyses/types";
import { useScrollSync, useUrlSearchParams } from "@utils/hooks";
import { filter, map } from "lodash-es";
import React, { useRef } from "react";
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
    const isolateRefs = useRef([]);
    useScrollSync(isolateRefs.current, filtered);

    const isolateComponents = map(filtered, (isolate, index) => {
        return (
            <PathoscopeIsolate
                key={isolate.id}
                {...isolate}
                reads={Math.round(isolate.pi * mappedCount)}
                showPathoscopeReads={showReads}
                isolateRef={element => (isolateRefs.current[index] = element)}
            />
        );
    });

    return <div>{isolateComponents}</div>;
}
