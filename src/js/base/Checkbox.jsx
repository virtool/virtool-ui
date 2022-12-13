import * as RadixCheckbox from "@radix-ui/react-checkbox";
import React from "react";
import { Icon } from "./Icon";
import styled from "styled-components";

const getBackgroundColor = ({ checked, theme }) => theme.color[checked ? "primary" : "transparent"];
const getBorder = ({ checked, theme }) => (checked ? "none" : `2px solid ${theme.color.greyDark}`);
const getColor = ({ checked, theme }) => theme.color[checked ? "white" : "grey"];

const CheckboxContainer = styled.div`
    display: inline-flex;
`;

export const CheckboxLabel = styled.span`
    vertical-align: bottom;
    cursor: pointer;
    margin-left: 5px;
    user-select: none;
`;

export const StyledCheckbox = styled(RadixCheckbox.Root)`
    align-items: center;
    background-color: ${getBackgroundColor};
    border: ${getBorder};
    border-radius: ${props => props.theme.borderRadius.sm};
    color: ${getColor};
    cursor: pointer;
    display: inline-flex;
    font-size: 11px;
    height: 20px;
    justify-content: center;
    margin-right: 0;
    opacity: ${props => (props.checked ? 1 : 0.5)};
    transition: opacity 100ms ease;
    width: 20px;
`;

export const Checkbox = ({ checked, label, onClick, disabled }) => (
    <CheckboxContainer>
        <StyledCheckbox
            disabled={disabled}
            checked={checked}
            onClick={disabled ? null : onClick}
            aria-label={label || "checkbox"}
        >
            <Icon checked={checked} name="check" />
            <RadixCheckbox.Indicator />
        </StyledCheckbox>
        {label ? <CheckboxLabel onClick={disabled ? null : onClick}>{label}</CheckboxLabel> : null}
    </CheckboxContainer>
);

Checkbox.defaultProps = {
    checked: false,
    disabled: false
};
