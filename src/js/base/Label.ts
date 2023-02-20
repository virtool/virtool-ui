import styled from "styled-components/macro";
import { getBadgeOrLabelColor } from "./utils";

type LabelProps = {
    color?: string;
    spaced?: boolean;
};

export const Label = styled.span<LabelProps>`
    background-color: ${getBadgeOrLabelColor};
    border-radius: ${props => props.theme.borderRadius.sm};
    color: ${props => props.theme.color.white};
    display: inline;
    font-size: ${props => props.theme.fontSize.sm};
    font-weight: bold;
    padding: 3px 5px;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;

    ${props => (props.spaced ? "margin-right: 5px;" : "")}

    &:last-of-type {
        margin: 0;
    }
`;
