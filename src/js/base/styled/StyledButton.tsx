import { get } from "lodash-es";
import styled, { DefaultTheme } from "styled-components";
import { getColorProps } from "../../app/theme";

function getButtonHoverColor({ color, theme }: getColorProps): string {
    if (color && color !== "grey") {
        return get(theme, ["color", `${color}Dark`], theme.color.white);
    }

    return theme.color.greyLightest;
}

function getButtonForegroundColor({ color, theme }: getColorProps): string {
    if (!color || color === "grey") {
        return theme.color.black;
    }

    return theme.color.white;
}

function getButtonBorderColor({ color, theme }: getColorProps): string {
    if (!color || color === "grey") {
        return theme.color.greyLight;
    }

    return theme.color[color];
}

type getButtonBackgroundColorProps = {
    active?: boolean;
    color?: string;
    theme: DefaultTheme;
};

function getButtonBackgroundColor({ active = true, color, theme }: getButtonBackgroundColorProps): string {
    if (!color || color === "grey") {
        return active ? theme.color.greyLightest : theme.color.white;
    }

    return get(theme, ["color", `${color}${active ? "Dark" : ""}`], theme.color.white);
}

type StyledButtonProps = {
    active?: boolean;
    as?: any;
    color?: string;
    theme: DefaultTheme;
};

export const StyledButton = styled.button<StyledButtonProps>`
    align-items: center;
    background-color: ${getButtonBackgroundColor};
    background-image: none;
    border: 1px solid ${getButtonBorderColor};
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => (props.active ? props.theme.boxShadow.inset : "")};
    color: ${getButtonForegroundColor};
    cursor: pointer;
    display: inline-flex;
    font-weight: 500;
    justify-content: center;
    margin-bottom: 0;
    min-width: 42px;
    min-height: 36px;
    opacity: ${props => (props.disabled ? 0.5 : 1)};
    padding: 0 10px;
    position: relative;
    user-select: none;
    touch-action: manipulation;
    transition: box-shadow 200ms ease-in-out;
    white-space: nowrap;

    i + span {
        margin-left: 5px;
    }

    :focus {
        color: ${getButtonForegroundColor};
    }

    :disabled {
        cursor: not-allowed;
    }

    :not(:disabled):hover {
        background-color: ${getButtonHoverColor};
        border-color: ${getButtonHoverColor};
        color: ${getButtonForegroundColor};
    }

    :not(:disabled)::after {
        border-radius: ${props => props.theme.borderRadius.sm};
        box-shadow: ${props => props.theme.boxShadow.lg};
        content: "";
        height: 100%;
        width: 100%;
        opacity: 0;
        position: absolute;
        transition: opacity 150ms ease, scale 150ms ease;
    }

    :not(:disabled):hover::after {
        opacity: 1;
    }
`;

StyledButton.displayName = "StyledButton";
