import { getColorProps, getFontWeight } from "@app/theme";
import styled from "styled-components";

function getAlertBackgroundColor({ color, theme }: getColorProps) {
    return theme.color[`${color}Lightest`] ?? theme.color.greyLightest;
}

function getAlertTextColor({ color, theme }: getColorProps) {
    return theme.color[`${color}Dark`] ?? theme.color.greyDarkest;
}

const AlertOuter = styled.div`
    background-color: ${getAlertBackgroundColor};
    border-radius: ${(props) => props.theme.borderRadius.md};
    border: none;
    box-shadow: ${(props) => props.theme.boxShadow.sm};
    color: ${getAlertTextColor};
    font-weight: ${getFontWeight("thick")};
    margin-bottom: 16px;
    overflow: hidden;

    svg:first-child {
        color: currentColor;
        padding-right: 5px;
    }
`;

export default AlertOuter;
