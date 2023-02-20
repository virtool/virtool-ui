import styled, { DefaultTheme } from "styled-components/macro";
import { Box } from "./Box";

type SelectBoxProps = {
    active: boolean;
    theme: DefaultTheme;
};

export const SelectBox = styled(Box).attrs(() => ({
    type: "button",
    as: "button"
}))<SelectBoxProps>`
    border: 1px ${props => (props.active ? props.theme.color.blue : props.theme.color.greyLight)} solid;
    border-radius: ${props => props.theme.borderRadius.sm};
    box-shadow: ${props => (props.active ? props.theme.boxShadow.inset : "none")};
    background-color: ${props => props.theme.color.white};
    text-align: left;
    div {
        font-weight: ${props => props.theme.fontWeight.thick};
        padding-bottom: 5px;
    }

    span {
        color: ${props => props.theme.color.greyDarkest};
        padding-top: 5px;
    }
`;
