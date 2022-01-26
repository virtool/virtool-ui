import React, { useMemo } from "react";
import { getColor, getFontWeight, theme } from "../app/theme";
import { reduce } from "lodash-es";
import styled from "styled-components";

const iconSize = {
    xs: "12px",
    sm: "16px",
    md: "20px",
    lg: "28px",
    xl: "44px",
    xxl: "60px"
};
const fontSize = {
    xs: "6px",
    sm: "8px",
    md: "10px",
    lg: "14px",
    xl: "22px",
    xxl: "30px"
};

const getIconSize = size => iconSize[size];
const getFontSize = size => fontSize[size];

export const StyledInitialIcon = styled.span`
    border-radius: 50%;
    display: inline-flex;
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
    height: ${props => getIconSize(props.size)};
    width: ${props => getIconSize(props.size)};
    font-size: ${props => getFontSize(props.size)};
    font-weight: ${getFontWeight("bold")};
    color: ${getColor({ color: "white", theme })};
    background: ${props => `hsl(${props.hash}, 83%, 21%);`};
`;

const colorHash = (hash, newChar) => (hash << 5) - newChar.charCodeAt(0);

export const InitialIcon = ({ handle, size }) => {
    const hash = useMemo(() => reduce(handle.split(""), colorHash, 0) % 360, [handle]);
    return (
        <StyledInitialIcon hash={hash} size={size} className="InitialIcon">
            {handle.slice(0, 2).toUpperCase()}
        </StyledInitialIcon>
    );
};
