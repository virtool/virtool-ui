import styled from "styled-components/macro";
import { getBadgeOrLabelColor } from "./utils";

type BadgeProps = {
    color?: "blue" | "green" | "red" | "orange" | "purple";
};

export const Badge = styled.span<BadgeProps>`
    background-color: ${getBadgeOrLabelColor};
    border-radius: ${props => props.theme.borderRadius.lg};
    color: ${props => props.theme.color.white};
    display: inline-block;
    min-width: 10px;
    padding: 3px 7px;
    font-size: ${props => props.theme.fontSize.sm};
    font-weight: bold;
    line-height: 1;
    text-align: center;
    vertical-align: middle;
    white-space: nowrap;
`;
