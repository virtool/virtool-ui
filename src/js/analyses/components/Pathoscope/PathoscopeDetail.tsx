import { useUrlSearchParams } from "@utils/hooks";
import { filter, map } from "lodash-es";
import React from "react";
import { ScrollSync } from "react-scroll-sync";
import { PathoscopeIsolate } from "./Isolate";

/** Detailed coverage for a single OTU hits from pathoscope analysis*/
export const PathoscopeDetail = ({ hit, mappedCount }) => {
    const [filterIsolates] = useUrlSearchParams<boolean>("filterIsolates");
    const [showReads] = useUrlSearchParams<boolean>("reads");
    const { isolates, pi } = hit;

    const filtered = filter(isolates, isolate => !filterIsolates || isolate.pi >= 0.03 * pi);
    const isolateComponents = map(filtered, isolate => (
        <PathoscopeIsolate
            key={isolate.id}
            {...isolate}
            reads={Math.round(isolate.pi * mappedCount)}
            showPathoscopeReads={showReads}
        />
    ));

    return (
        <div>
            <ScrollSync>
                <div>{isolateComponents}</div>
            </ScrollSync>
        </div>
    );
};
