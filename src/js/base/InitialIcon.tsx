import { reduce } from "lodash-es";
import React, { useMemo } from "react";
import styled from "styled-components";
import { getColor, getFontWeight, theme } from "../app/theme";

const iconSize = {
    xs: "12px",
    sm: "16px",
    md: "20px",
    lg: "28px",
    xl: "44px",
    xxl: "60px",
};

const fontSize = {
    xs: "6px",
    sm: "8px",
    md: "10px",
    lg: "14px",
    xl: "22px",
    xxl: "30px",
};

function getIconSize(size: string): string {
    return iconSize[size];
}

function getFontSize(size: string): string {
    return fontSize[size];
}

function hashColor(hash, newChar) {
    return (hash << 5) - newChar.charCodeAt(0);
}

type StyledInitialIconProps = {
    size: string;
    hash: number;
};

const StyledInitialIcon = styled.svg<StyledInitialIconProps>`
    height: ${(props) => getIconSize(props.size)};
    width: ${(props) => getIconSize(props.size)};
    overflow: visible;

    circle {
        cx: ${(props) => getFontSize(props.size)};
        cy: ${(props) => getFontSize(props.size)};
        r: ${(props) => getFontSize(props.size)};
        fill: ${(props) => `hsl(${props.hash}, 83%, 21%);`};
    }
    text {
        text-anchor: middle;
        fill: ${getColor({ color: "white", theme })};
        font-size: ${(props) => getFontSize(props.size)};
        font-weight: ${getFontWeight("bold")};
    }
`;

type InitialIconProps = {
    handle: string;
    size: string;
};

export default function InitialIcon({ handle, size }: InitialIconProps) {
    const hash = useMemo(
        () => reduce(handle.split(""), hashColor, 0) % 360,
        [handle],
    );

    return (
        <StyledInitialIcon size={size} hash={hash} className="InitialIcon">
            <circle>{handle.slice(0, 2).toUpperCase()}</circle>
            <text x="1em" y="1em" dy=".35em">
                {handle.slice(0, 2).toUpperCase()}
            </text>
        </StyledInitialIcon>
    );
}
