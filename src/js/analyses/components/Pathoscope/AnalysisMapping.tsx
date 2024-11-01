import { map } from "lodash-es";
import numbro from "numbro";
import React from "react";
import styled from "styled-components";

import { Box, Label, Link } from "@base";
import { toThousand } from "../../../utils/utils";
import { Bars } from "../Viewer/Bars";

const StyledAnalysisMappingReferenceTitle = styled.div`
    align-items: center;
    display: flex;

    a {
        margin-right: 5px;
    }
`;

export function AnalysisMappingReferenceTitle({ index, reference }) {
    return (
        <StyledAnalysisMappingReferenceTitle>
            <Link to={`/refs/${reference.id}`}>{reference.name}</Link>
            <Label>{index.version}</Label>
        </StyledAnalysisMappingReferenceTitle>
    );
}

export function AnalysisMappingSubtractionTitle({ subtractions }) {
    return map(subtractions, (subtraction, index) => (
        <span key={subtraction.id}>
            <Link to={`/subtractions/${subtraction.id}`}>{subtraction.name}</Link>
            {index !== subtractions.length - 1 ? ", " : ""}
        </span>
    ));
}

const StyledAnalysisMapping = styled(Box)`
    margin-bottom: 30px;

    h3 {
        align-items: flex-end;
        display: flex;
        font-size: ${props => props.theme.fontSize.xl};
        font-weight: normal;
        margin: 15px 0 10px;
        justify-content: space-between;

        small {
            color: ${props => props.theme.color.greyDark};
            font-size: ${props => props.theme.fontSize.lg};
            font-weight: 600;
        }
    }
`;

export function AnalysisMapping({ totalReads, detail }) {
    const { index, reference, subtractions, results } = detail;
    const { readCount, subtractedCount } = results;

    const totalMapped = readCount + subtractedCount;
    const sumPercent = readCount / totalReads;

    const legend = [
        {
            color: "blue",
            count: readCount,
            title: <AnalysisMappingReferenceTitle index={index} reference={reference} />,
        },
    ];

    if (subtractions.length > 0) {
        legend.push({
            color: "orange",
            count: subtractedCount,
            title: <AnalysisMappingSubtractionTitle subtractions={subtractions} />,
        });
    }

    return (
        <StyledAnalysisMapping>
            <h3>
                {numbro(sumPercent).format({ output: "percent", mantissa: 2 })} mapped
                <small>
                    {toThousand(readCount)} of {toThousand(totalReads)} reads
                </small>
            </h3>

            <Bars empty={totalReads - totalMapped} items={legend} />
        </StyledAnalysisMapping>
    );
}
