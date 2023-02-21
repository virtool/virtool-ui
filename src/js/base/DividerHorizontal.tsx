import React from "react";
import styled from "styled-components";
import { getColor } from "../app/theme";

const DividerHorizontalBorder = styled.div`
    background-color: ${getColor};
    height: 2px;
    flex: 1 0;
`;

const DividerHorizontalText = styled.div`
    color: ${getColor};
    margin: 0 5px;
    text-transform: capitalize;
`;

const StyledDividerHorizontal = styled.div`
    align-items: center;
    display: flex;
    flex-direction: row;
`;

type DividerHorizontalProps = {
    className?: string;
    text?: string;
};

export const DividerHorizontal = ({ text, className }: DividerHorizontalProps) => (
    <StyledDividerHorizontal className={className}>
        <DividerHorizontalBorder color="greyLight" />
        {text && <DividerHorizontalText color="grey">{text}</DividerHorizontalText>}
        <DividerHorizontalBorder color="greyLight" />
    </StyledDividerHorizontal>
);
