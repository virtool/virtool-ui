import AnalysisValue from "@analyses/components/AnalysisValue";
import {
    IimiHit,
    IimiIsolate as IimiIsolateData,
    IimiSequence,
} from "@analyses/types";
import { convertRleToCoverage, maxSequences } from "@analyses/utils";
import { formatIsolateName } from "@app/utils";
import AccordionContent from "@base/AccordionContent";
import AccordionScrollingItem from "@base/AccordionScrollingItem";
import AccordionTrigger from "@base/AccordionTrigger";
import { filter, map, sortBy, sum, unzip } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { IimiCondensedCoverage } from "./IimiCondensedCoverage";
import { IimiDetection } from "./IimiDetection";
import { IimiIsolate } from "./IimiIsolate";

const IimiAccordionTrigger = styled(AccordionTrigger)`
    display: flex;
    flex-direction: column;
    overflow: hidden;

    & > div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
`;

type IimiOtuProps = {
    hit: IimiHit;
    probability: number;
};

/** Collapsible results of an Iimi analysis for a single otu */
export function IimiOtu({
    hit: { id, isolates, name, result },
    probability,
}: IimiOtuProps) {
    const sequences = sortBy(
        unzip(map(isolates, "sequences")),
        (seqs) => seqs[0]?.length,
    );

    const composited = map(sequences, (seqs: IimiSequence[]) => {
        const filteredSeqs = filter(seqs);
        return maxSequences(
            map(filteredSeqs, (seq: IimiSequence) => {
                return convertRleToCoverage(
                    seq.coverage.lengths,
                    seq.coverage.values,
                );
            }),
        );
    });

    const totalSequenceLength = map(composited, (seq) => seq.length).reduce(
        (a, b) => a + b,
        0,
    );

    const totalCoveredPositions = sum(
        map(composited, (seq) => {
            return seq.filter((pos) => pos > 0).length;
        }),
    );

    const coverage = (totalCoveredPositions / totalSequenceLength).toFixed(4);

    return (
        <AccordionScrollingItem value={id}>
            <IimiAccordionTrigger>
                <div className="flex justify-between mb-3">
                    <h3 className="font-medium text-lg">{name}</h3>
                    <div className="flex gap-4">
                        <IimiDetection
                            probability={probability}
                            result={result}
                        />
                        <AnalysisValue
                            color="blue"
                            value={coverage}
                            label="COVERAGE"
                        />
                    </div>
                </div>
                <IimiCondensedCoverage isolates={isolates} />
            </IimiAccordionTrigger>
            <AccordionContent>
                {map(isolates, (isolate: IimiIsolateData) => (
                    <IimiIsolate
                        name={formatIsolateName(isolate)}
                        sequences={isolate.sequences}
                        key={isolate.id}
                    />
                ))}
            </AccordionContent>
        </AccordionScrollingItem>
    );
}
