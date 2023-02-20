import React from "react";
import styled from "styled-components/macro";
import { getColor } from "../app/theme";

const DividerVerticalBorder = styled.div`
    width: 2px;
    background-color: ${getColor};
    flex: 1 0;
`;

const DividerVerticalText = styled.div`
    color: ${getColor};
    margin: 0 5px;
    text-transform: capitalize;
`;

export const StyledDividerVertical = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
`;

type DividerVerticalProps = {
    className?: string;
    text?: string;
};

export const DividerVertical = ({ className = "", text = "" }: DividerVerticalProps) => (
    <StyledDividerVertical className={className}>
        <DividerVerticalBorder color="greyLight" />
        {text && <DividerVerticalText color="grey">{text}</DividerVerticalText>}
        <DividerVerticalBorder color="greyLight" />
    </StyledDividerVertical>
);
