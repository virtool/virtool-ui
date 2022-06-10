import { get } from "lodash-es";
import PropTypes from "prop-types";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import { Tooltip } from "./Tooltip";

const getIconColor = ({ color, theme }) => get(theme, ["color", color], "inherit");
const getIconHoverColor = ({ color, theme }) => get(theme, ["color", `${color}Dark`], "inherit");

const fixedWidth = css`
    width: 8px;
    text-align: center;
    display: inline-block;
`;

const StyledIcon = styled.i`
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

export const Icon = ({ hoverable, style, ...props }) => {
    const handleClick = useCallback(props.onClick, [props.onClick]);

    const className = `${props.className ? props.className + " " : ""} ${props.faStyle} fa-${props.name}`;
    const icon = (
        <StyledIcon
            as={props.onClick ? "button" : "i"}
            type="button"
            className={className}
            fixedWidth={props.fixedWidth}
            hoverable={hoverable}
            style={style}
            onClick={props.onClick ? handleClick : null}
            color={props.color}
            shade={props.shade}
            aria-label={props["aria-label"]}
        />
    );

    if (props.tip) {
        return (
            <Tooltip position={props.tipPlacement || "top"} tip={props.tip}>
                {icon}
            </Tooltip>
        );
    }

    return icon;
};

Icon.propTypes = {
    color: PropTypes.oneOf(["blue", "green", "grey", "red", "orange", "purple"]),
    name: PropTypes.string.isRequired,
    tip: PropTypes.node,
    tipPlacement: PropTypes.oneOf(["top", "right", "bottom", "left"]),
    faStyle: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    fixedWidth: PropTypes.bool,
    style: PropTypes.object,
    "aria-label": PropTypes.string,
    hoverable: PropTypes.bool,
    shade: PropTypes.string
};

Icon.defaultProps = {
    faStyle: "fas",
    fixedWidth: false
};

export const LinkIcon = ({ to, replace, ...props }) => (
    <Link to={to} replace={replace}>
        <Icon {...props} hoverable />
    </Link>
);
