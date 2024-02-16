import { filter, map, unzip } from "lodash-es";
import React from "react";
import { IimiIsolate, IimiSequence } from "../../types";
import { SummaryChart } from "../Charts/SummaryChart";
import { averageSequences, combineUntrustworthyRegions, convertRleToCoverage } from "../Charts/utils";

/** A graph of averaged Iimi analysis sequence coverage */
export function CondensedIimiCoverage({ isolates }: { isolates: IimiIsolate[] }) {
    const sequences = unzip(map(isolates, "sequences"));

    const charts = map(sequences, (seqs: IimiSequence[]) => {
        const avgSeq = averageSequences(
            map(filter(seqs), (seq: IimiSequence) => {
                return convertRleToCoverage(seq.coverage.lengths, seq.coverage.values);
            }),
        );
        return (
            <SummaryChart
                data={avgSeq}
                id={isolates[0].id}
                yMax={Math.max(...avgSeq, 10)}
                untrustworthyRanges={combineUntrustworthyRegions(
                    map(seqs, sequence => (sequence ? sequence.untrustworthy_ranges : [])),
                )}
            />
        );
    });

    return <div>{charts}</div>;
}
