import { Box } from "@base";
import { sortBy } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { CoverageChart } from "../Charts/CoverageChart";

import { convertRleToCoverage } from "../../utils";
import { IimiDetectionTag } from "./IimiDetectionTag";

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
                            <IimiDetectionTag result={sequence.result} />
                        </p>
                        <CoverageChart
                            data={convertRleToCoverage(
                                sequence.coverage.lengths,
                                sequence.coverage.values,
                            )}
                            id={sequence.id}
                            yMax={Math.max(...sequence.coverage.values, 10)}
                            untrustworthyRanges={sequence.untrustworthy_ranges}
                        />
                    </Box>
                ))}
            </CoveragePanel>
        </div>
    );
}
