import { get } from "lodash-es";
import React, { useCallback } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import { getColorProps } from "../app/theme";
import { IconColor } from "../jobs/types";
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

type StyledIconProps = {
    color?: "blue" | "green" | "grey" | "red" | "orange" | "purple";
    hoverable?: boolean;
    $fixedWidth?: boolean;
    theme: DefaultTheme;
};

const StyledIcon = styled.i<StyledIconProps>`
    background: inherit;
    border: none;
    color: ${getIconColor};
    ${props => (props.hoverable || props.onClick ? "cursor: pointer;" : "")};
    ${props => (props.$fixedWidth ? fixedWidth : "")};

    &:hover {
        ${props =>
            props.hoverable || props.onClick
                ? `color: ${getIconHoverColor({ color: props.color, theme: props.theme })};`
                : ""};
    }
`;

StyledIcon.displayName = "Icon";

type IconProps = {
    "aria-label"?: string;
    color?: IconColor;
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
    title?: string;
};

export function Icon({
    faStyle = "fas",
    fixedWidth = false,
    hoverable,
    style,
    tip,
    tipPlacement,
    title,
    ...props
}: IconProps) {
    const handleClick = useCallback(props.onClick, [props.onClick]);

    const className = `${props.className ? props.className + " " : ""} ${faStyle} fa-${props.name}`;

    const type = props.onClick ? "button" : undefined;

    const icon = (
        <StyledIcon
            as={props.onClick ? "button" : "i"}
            aria-label={props["aria-label"]}
            className={className}
            color={props.color}
            $fixedWidth={fixedWidth}
            hoverable={hoverable}
            style={style}
            title={title}
            type={type}
            onClick={props.onClick ? handleClick : null}
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
}
