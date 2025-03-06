import ScrollSync from "@base/ScrollSync";
import { useUrlSearchParam } from "@/hooks";
import { toScientificNotation } from "@/utils";
import React from "react";
import PathoscopeSequence from "./PathoscopeSequence";

export default function PathoscopeIsolate({
    coverage,
    depth,
    maxDepth,
    maxGenomeLength,
    name,
    pi,
    reads,
    sequences,
}) {
    const { value: showReads } = useUrlSearchParam<boolean>("showReads");

    const totalLength = sequences.reduce(
        (acc, hit) => acc + hit.filled.length,
        0,
    );

    const sequenceComponents = sequences.map((hit) => {
        let ratio = 1;

        if (sequences.length > 1) {
            ratio = hit.filled.length / totalLength;
        }

        return (
            <PathoscopeSequence
                key={hit.accession}
                accession={hit.accession}
                data={hit.align}
                definition={hit.definition}
                maxGenomeLength={maxGenomeLength}
                id={hit.id}
                length={hit.filled.length}
                ratio={ratio}
                yMax={maxDepth}
            />
        );
    });

    return (
        <div className="mb-6 relative">
            <div className="flex gap-4 items-end mb-2 text-lg font-medium">
                {name}
                <div className="flex gap-2 text-base">
                    <span className="text-green-700">
                        {showReads ? reads : toScientificNotation(pi)}
                    </span>
                    <span className="text-red-700">{depth.toFixed(0)}</span>
                    <span className="text-blue-700">
                        {toScientificNotation(parseFloat(coverage))}
                    </span>
                </div>
            </div>
            <ScrollSync className="flex gap-4">{sequenceComponents}</ScrollSync>
        </div>
    );
}
