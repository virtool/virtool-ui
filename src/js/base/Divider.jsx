import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { getColor } from "../app/theme";

const HorizontalBorder = styled.div`
    height: 2px;
    background-color: ${getColor};
    flex: 1 0;
`;

const StyledText = styled.span`
    color: ${getColor};
    margin: 0 5px;
    text-transform: capitalize;
`;

const StyledHorizontalDivider = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

export const HorizontalDivider = ({ text, className }) => (
    <StyledHorizontalDivider className={className}>
        <HorizontalBorder color="greyLight" />
        {text && <StyledText color="grey">{text}</StyledText>}
        <HorizontalBorder color="greyLight" />
    </StyledHorizontalDivider>
);

HorizontalDivider.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string
};

HorizontalDivider.defaultProps = {
    text: "",
    className: ""
};

const VerticalBorder = styled.div`
    width: 2px;
    background-color: ${getColor};
    flex: 1 0;
`;

const StyledVerticalDivider = styled(StyledHorizontalDivider)`
    flex-direction: column;
`;

export const VerticalDivider = ({ text, className }) => (
    <StyledVerticalDivider className={className}>
        <VerticalBorder color="greyLight" />
        {text && <StyledText color="grey">{text}</StyledText>}
        <VerticalBorder color="greyLight" />
    </StyledVerticalDivider>
);

VerticalDivider.propTypes = {
    text: PropTypes.string,
    className: PropTypes.string
};

VerticalDivider.defaultProps = {
    text: "",
    className: ""
};
