import { getColor, getFontSize } from "@app/theme";
import { SmallSampleLabel } from "@samples/components/Label/SmallSampleLabel";
import React from "react";
import styled from "styled-components";

const StyledParagraph = styled.div`
    color: ${props => getColor({ theme: props.theme, color: "greyDarkest" })};
    font-size: ${getFontSize("sm")};
`;

type SampleLabelInnerProps = {
    color: string;
    description: string;
    name: string;
};

/**
 * Styled label item for use in dropdown list of labels
 */
export default function SampleLabelInner({ color, description, name }: SampleLabelInnerProps) {
    return (
        <div>
            <SmallSampleLabel color={color} name={name} />
            <StyledParagraph>{description}</StyledParagraph>
        </div>
    );
}
