import React from "react";
import styled from "styled-components";

const StyledCreateAnalysisSummary = styled.div`
    margin: 0;
    text-align: left;
`;

interface CreateAnalysisSummaryProps {
    indexCount: number;
    sampleCount: number;
}

export function CreateAnalysisSummary({
    indexCount,
    sampleCount,
}: CreateAnalysisSummaryProps) {
    const product = indexCount * sampleCount;

    if (product === 0) {
        return <StyledCreateAnalysisSummary />;
    }

    return (
        <StyledCreateAnalysisSummary>
            {product} job
            {product === 1 ? "" : "s"} will be started
        </StyledCreateAnalysisSummary>
    );
}
