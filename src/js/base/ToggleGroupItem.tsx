import { getFontSize } from "@app/theme";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import styled from "styled-components";

export const ToggleGroupItem = styled(ToggleGroupPrimitive.Item)`
    background-color: ${props => props.theme.color.white};
    font-size: ${getFontSize("md")};
    color: black;
    height: 35px;
    width: 60px;
    margin: 2px;
    display: flex;
    line-height: 1;
    align-items: center;
    justify-content: center;

    &:first-child {
        margin-left: 0;
        border-top-left-radius: ${props => props.theme.borderRadius.sm};
        border-bottom-left-radius: ${props => props.theme.borderRadius.sm};
    }
    &:last-child {
        border-top-right-radius: ${props => props.theme.borderRadius.sm};
        border-bottom-right-radius: ${props => props.theme.borderRadius.sm};
    }

    &:hover {
        background-color: ${props => props.theme.color.greyLightest};
    }

    &:focus {
        position: relative;
        box-shadow: 0 0 0 2px black;
    }

    &[data-state="on"] {
        background-color: ${props => props.theme.color.greyLight};
        color: white;
    }
`;
