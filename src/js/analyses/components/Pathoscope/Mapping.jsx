import { map } from "lodash-es";
import numbro from "numbro";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Box, Label } from "../../../base";
import { toThousand } from "../../../utils/utils";
import { getReadCount, getSubtractedCount } from "../../selectors";
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
        <>
            <Link to={`/subtractions/${subtraction.id}`}>{subtraction.name}</Link>
            {index !== subtractions.length - 1 ? ", " : ""}
        </>
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

export function AnalysisMapping({ index, reference, subtractions, toReference, total, toSubtraction = 0 }) {
    const totalMapped = toReference + toSubtraction;
    const sumPercent = toReference / total;

    const legend = [
        {
            color: "blue",
            count: toReference,
            title: <AnalysisMappingReferenceTitle index={index} reference={reference} />,
        },
    ];

    if (subtractions.length > 0) {
        legend.push({
            color: "orange",
            count: toSubtraction,
            title: <AnalysisMappingSubtractionTitle subtractions={subtractions} />,
        });
    }

    return (
        <StyledAnalysisMapping>
            <h3>
                {numbro(sumPercent).format({ output: "percent", mantissa: 2 })} mapped
                <small>
                    {toThousand(toReference)} of {toThousand(total)} reads
                </small>
            </h3>

            <Bars empty={total - totalMapped} items={legend} />
        </StyledAnalysisMapping>
    );
}

export function mapStateToProps(state) {
    const { index, reference, subtractions } = state.analyses.detail;

    return {
        index,
        reference,
        subtractions,
        toReference: getReadCount(state),
        toSubtraction: getSubtractedCount(state),
        total: state.samples.detail.quality.count,
    };
}

export default connect(mapStateToProps)(AnalysisMapping);
