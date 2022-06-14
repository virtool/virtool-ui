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

export const AnalysisMappingReferenceTitle = ({ index, reference }) => (
    <StyledAnalysisMappingReferenceTitle>
        <Link to={`/refs/${reference.id}`}>{reference.name}</Link>
        <Label>{index.version}</Label>
    </StyledAnalysisMappingReferenceTitle>
);

export const AnalysisMappingSubtractionTitle = ({ subtraction }) => (
    <Link to={`/subtractions/${subtraction.id}`}>{subtraction.name}</Link>
);

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

export const AnalysisMapping = ({ index, reference, subtraction, toReference, total, toSubtraction = 0 }) => {
    const totalMapped = toReference + toSubtraction;
    const sumPercent = toReference / total;

    const referenceTitle = <AnalysisMappingReferenceTitle index={index} reference={reference} />;
    const subtractionTitle = <AnalysisMappingSubtractionTitle subtraction={subtraction} />;

    return (
        <StyledAnalysisMapping>
            <h3>
                {numbro(sumPercent).format({ output: "percent", mantissa: 2 })} mapped
                <small>
                    {toThousand(toReference)} of {toThousand(total)} reads
                </small>
            </h3>

            <Bars
                empty={total - totalMapped}
                items={[
                    { color: "blue", count: toReference, title: referenceTitle },
                    { color: "orange", count: toSubtraction, title: subtractionTitle }
                ]}
            />
        </StyledAnalysisMapping>
    );
};

export const mapStateToProps = state => {
    const { index, reference, subtractions } = state.analyses.detail;

    return {
        index,
        reference,
        subtraction: subtractions[0],
        toReference: getReadCount(state),
        toSubtraction: getSubtractedCount(state),
        total: state.samples.detail.quality.count
    };
};

export default connect(mapStateToProps)(AnalysisMapping);
