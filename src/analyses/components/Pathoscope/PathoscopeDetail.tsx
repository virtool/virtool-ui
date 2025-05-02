import { useUrlSearchParam } from "../../../app/hooks";
import { FormattedPathoscopeHit } from "../../types";
import ScrollSyncContainer from "../../../base/ScrollSyncContainer";
import { filter, maxBy } from "lodash-es";
import React from "react";
import PathoscopeIsolate from "./PathoscopeIsolate";

type PathoscopeDetailProps = {
    /** Complete information for a pathoscope hit */
    hit: FormattedPathoscopeHit;
    /** The total number of reads mapped to any OTU during the analysis*/
    mappedCount: number;
};

/** Detailed coverage for a single OTU hits from pathoscope analysis*/
export default function PathoscopeDetail({
    hit,
    mappedCount,
}: PathoscopeDetailProps) {
    const { value: filterIsolates } =
        useUrlSearchParam<boolean>("filterIsolates");

    const { isolates, pi } = hit;

    const filtered = filter(
        isolates,
        (isolate) => !filterIsolates || isolate.pi >= 0.03 * pi,
    );

    const maxGenomeLength = maxBy(filtered, (item) => item.filled.length).filled
        .length;

    const isolateComponents = filtered.map((isolate) => {
        return (
            <PathoscopeIsolate
                key={isolate.id}
                {...isolate}
                maxGenomeLength={maxGenomeLength}
                reads={Math.round(isolate.pi * mappedCount)}
            />
        );
    });

    return (
        <div className="pt-4">
            <ScrollSyncContainer>{isolateComponents}</ScrollSyncContainer>
        </div>
    );
}
