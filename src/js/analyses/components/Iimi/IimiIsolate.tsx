import { sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { Box, Label } from "../../../base";
import { IimiCoverageChart } from "./IimiCoverage";

/**
 * Convert range length encoded data into an array of depth values.
 */
function convertRleToCoverage(lengths: Array<number>, rle: Array<number>) {
    const coverage = [];

    for (let sharedIndex = 0; sharedIndex < lengths.length; sharedIndex++) {
        const length = lengths[sharedIndex];
        const value = rle[sharedIndex];

        coverage.push(...Array(length).fill(value));
    }

    return coverage;
}

const CoveragePanel = styled.div`
    align-items: center;
    display: flex;
    gap: 15px;
    overflow-x: scroll;
`;

export function IimiIsolate({ name, sequences }) {
    const sorted = sortBy(sequences, sequence => sequence.length);

    return (
        <div>
            <h5>{name}</h5>
            <CoveragePanel>
                {sorted.map(sequence => (
                    <Box key={sequence.id}>
                        <p>
                            {sequence.result ? (
                                <Label color="red">Detected</Label>
                            ) : (
                                <Label color="grey">Undetected</Label>
                            )}
                        </p>
                        <IimiCoverageChart
                            data={convertRleToCoverage(sequence.coverage.lengths, sequence.coverage.values)}
                            id={sequence.id}
                            yMax={100}
                        />
                    </Box>
                ))}
            </CoveragePanel>
        </div>
    );
}
