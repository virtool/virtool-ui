import { get } from "lodash-es";
import styled from "styled-components";
import { getColorProps, getFontWeight } from "../app/theme";

function getAlertBackgroundColor({ color, theme }: getColorProps) {
    return get(theme, ["color", `${color}Lightest`], theme.color.greyLightest);
}

function getAlertTextColor({ color, theme }: getColorProps) {
    return get(theme, ["color", `${color}Dark`], theme.color.greyDarkest);
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

    i.fas:first-child {
        color: currentColor;
        padding-right: 5px;
    }
`;

export default AlertOuter;
