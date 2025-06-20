import Box from "@base/Box";
import { sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { CoverageChart } from "../Charts/CoverageChart";
import { IimiDetection } from "./IimiDetection";

const CoveragePanel = styled.div`
    align-items: center;
    display: flex;
    gap: 15px;
    overflow-x: scroll;
`;

export function IimiIsolate({ name, sequences }) {
    const sorted = sortBy(sequences, (sequence) => sequence.length);

    return (
        <div>
            <h5>{name}</h5>
            <CoveragePanel>
                {sorted.map((sequence) => (
                    <Box key={sequence.id}>
                        <p>
                            <IimiDetection
                                probability={sequence.probability}
                                result={sequence.result}
                            />
                        </p>
                        <CoverageChart
                            data={sequence.coverage}
                            id={sequence.id}
                            yMax={Math.max(sequence.maxDepth, 10)}
                            untrustworthyRanges={sequence.untrustworthy_ranges}
                        />
                    </Box>
                ))}
            </CoveragePanel>
        </div>
    );
}
