import { get } from "lodash-es";
import React, { useCallback } from "react";
import { css } from "styled-components";
import styled, { DefaultTheme } from "styled-components/macro";
import { getColorProps } from "../app/theme";
import { Tooltip } from "./Tooltip";

function getIconColor({ color, theme }: getColorProps): string {
    return get(theme, ["color", color], "inherit");
}

function getIconHoverColor({ color, theme }: getColorProps): string {
    return get(theme, ["color", `${color}Dark`], "inherit");
}

const fixedWidth = css`
    width: 8px;
    text-align: center;
    display: inline-block;
`;

interface StyledIconProps {
    color?: "blue" | "green" | "grey" | "red" | "orange" | "purple";
    hoverable?: boolean;
    fixedWidth?: boolean;
    theme: DefaultTheme;
}

const StyledIcon = styled.i<StyledIconProps>`
    background: inherit;
    border: none;
    color: ${getIconColor};
    ${props => (props.hoverable || props.onClick ? "cursor: pointer;" : "")};
    ${props => (props.fixedWidth ? fixedWidth : "")};

    :hover {
        ${props =>
            props.hoverable || props.onClick
                ? `color: ${getIconHoverColor({ color: props.color, theme: props.theme })};`
                : ""};
    }
`;

interface IconProps {
    "aria-label"?: string;
    color?: "blue" | "green" | "grey" | "red" | "orange" | "purple";
    name: string;
    className?: string;
    faStyle?: "fas" | "far" | "fal" | "fab";
    fixedWidth?: boolean;
    hoverable?: boolean;
    onClick?: () => void;
    shade?: string;
    style?: any;
    tip?: string;
    tipPlacement?: "top" | "right" | "bottom" | "left";
}

export const Icon = ({
    faStyle = "fas",
    fixedWidth = false,
    hoverable,
    style,
    tip,
    tipPlacement,
    ...props
}: IconProps) => {
    const handleClick = useCallback(props.onClick, [props.onClick]);

    const className = `${props.className ? props.className + " " : ""} ${faStyle} fa-${props.name}`;

    const icon = (
        <StyledIcon
            as={props.onClick ? "button" : "i"}
            type="button"
            className={className}
            fixedWidth={fixedWidth}
            hoverable={hoverable}
            style={style}
            onClick={props.onClick ? handleClick : null}
            color={props.color}
            aria-label={props["aria-label"]}
        />
    );

    if (tip) {
        return (
            <Tooltip position={tipPlacement || "top"} tip={tip}>
                {icon}
            </Tooltip>
        );
    }

    return icon;
};
