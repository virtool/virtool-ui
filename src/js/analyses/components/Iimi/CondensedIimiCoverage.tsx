import { filter, map, sortBy, unzip } from "lodash-es";
import React from "react";
import { IimiIsolate, IimiSequence } from "../../types";
import {
    combineUntrustworthyRegions,
    convertRleToCoverage,
    maxSequences,
} from "../../utils";
import { SummaryChart } from "../Charts/SummaryChart";

/** A graph of averaged Iimi analysis sequence coverage */
export function CondensedIimiCoverage({
    isolates,
}: {
    isolates: IimiIsolate[];
}) {
    const sequences = sortBy(
        unzip(map(isolates, "sequences")),
        (seqs) => seqs[0]?.length,
    );

    const charts = map(sequences, (seqs: IimiSequence[]) => {
        const filteredSeqs = filter(seqs);
        const avgSeq = maxSequences(
            map(filteredSeqs, (seq: IimiSequence) => {
                return convertRleToCoverage(
                    seq.coverage.lengths,
                    seq.coverage.values,
                );
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
