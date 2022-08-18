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

const StyledInitialIcon = styled.svg`
    height: ${props => getIconSize(props.size)};
    width: ${props => getIconSize(props.size)};

    circle {
        cx: ${props => getFontSize(props.size)};
        cy: ${props => getFontSize(props.size)};
        r: ${props => getFontSize(props.size)};
        fill: ${props => `hsl(${props.hash}, 83%, 21%);`};
    }
    text {
        text-anchor: middle;
        fill: ${getColor({ color: "white", theme })};
        font-size: ${props => getFontSize(props.size)};
        font-weight: ${getFontWeight("bold")};
    }
`;

const colorHash = (hash, newChar) => (hash << 5) - newChar.charCodeAt(0);

export const InitialIcon = ({ handle, size }) => {
    const hash = useMemo(() => reduce(handle.split(""), colorHash, 0) % 360, [handle]);
    return (
        <StyledInitialIcon size={size} hash={hash} className="InitialIcon">
            <circle>{handle.slice(0, 2).toUpperCase()}</circle>
            <text x="1em" y="1em" dy=".35em">
                {handle.slice(0, 2).toUpperCase()}
            </text>
        </StyledInitialIcon>
    );
};
