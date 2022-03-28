import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { getColor } from "../app/theme";
import { Badge } from "./Badge";

const justificationRatio = { left: 5, center: 40, right: 75 };

const LeftBorder = styled.div`
    height: 2px;
    background-color: ${getColor};
    flex: 1 0 ${props => justificationRatio[props.justification]}%;
`;

const RightBorder = styled(LeftBorder)`
    flex: 1 0 ${props => 80 - justificationRatio[props.justification]}%;
`;

const StyledText = styled.span`
    color: ${getColor};
    margin: 0 5px;
    text-transform: capitalize;
`;

const StyledDivider = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0 5px;
`;

export const Divider = ({ text, justification }) => (
    <StyledDivider>
        <LeftBorder color="greyLight" justification={justification || "center"} />
        {text && <StyledText color="grey">{text}</StyledText>}
        <RightBorder color="greyLight" justification={justification || "center"} />
    </StyledDivider>
);

Badge.propTypes = {
    text: PropTypes.string,
    justifyText: PropTypes.string
};
