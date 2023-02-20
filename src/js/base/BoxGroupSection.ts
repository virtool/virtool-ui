import styled, { DefaultTheme } from "styled-components/macro";
import { getBorder } from "../app/theme";

type BoxGroupSectionProps = {
    active?: boolean;
    onClick?: () => void;
    theme: DefaultTheme;
};

export const BoxGroupSection = styled.div<BoxGroupSectionProps>`
    background-color: transparent;
    border: none;
    border-radius: 0;
    color: inherit;
    cursor: ${props => (props.onClick && !props.active ? "pointer" : "auto")};
    display: block;
    padding: 10px 15px;
    position: relative;
    text-align: left;
    width: 100%;

    &[disabled] {
        background-color: ${props => props.theme.color.greyHover};
        cursor: not-allowed;
        color: ${props => props.theme.color.grey};
        user-select: none;
    }

    &:hover {
        ${props => (props.onClick && !props.active ? `background-color: ${props.theme.color.greyHover};` : "")}
    }

    &:not(:last-child) {
        border-bottom: ${getBorder};
    }
`;
