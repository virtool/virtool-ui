import React from "react";
import styled from "styled-components";
import { BoxGroup, BoxGroupSection } from "../../../base";
import { getBorder } from "../../../app/theme";

const StyledCreateAnalysisSelectorList = styled(BoxGroup)`
    border: none;
    background-color: ${props => props.theme.color.greyLightest};
    margin: 0;
    overflow-y: auto;
    height: 160px;

    ${BoxGroupSection} {
        border-bottom: ${getBorder};
    }
`;
export const CreateAnalysisSelectorList = ({ className, render, items }) => (
    <StyledCreateAnalysisSelectorList className={className}>
        {items.map(item => render(item))}
    </StyledCreateAnalysisSelectorList>
);
