import { FormattedIimiIsolate } from "@analyses/types";
import { combineUntrustworthyRegions, maxSequences } from "@analyses/utils";
import { filter, map, sortBy, unzip } from "lodash-es";
import React from "react";
import { SummaryChart } from "../Charts/SummaryChart";

/** A graph of maximum Iimi analysis sequence coverage */
export function IimiCondensedCoverage({
    isolates,
}: {
    isolates: FormattedIimiIsolate[];
}) {
    const sequences = sortBy(
        unzip(map(isolates, "sequences")),
        (seqs) => seqs[0]?.length,
    );

    const charts = map(sequences, (seqs) => {
        const filteredSeqs = filter(seqs);
        const avgSeq = maxSequences(
            map(filteredSeqs, (seq) => {
                return seq.coverage;
            }),
        );

        return (
            <SummaryChart
                key={filteredSeqs[0].id}
                data={avgSeq}
                id={isolates[0].id}
                yMax={Math.max(...avgSeq, 10)}
                untrustworthyRanges={combineUntrustworthyRegions(
                    map(seqs, (sequence) =>
                        sequence ? sequence.untrustworthy_ranges : [],
                    ),
                )}
            />
        );
    });

    return <div>{charts}</div>;
}
