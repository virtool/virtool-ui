import styled from "styled-components";
import { borderRadius, getFontSize } from "../../../app/theme";

/**
 * Base workflow tag component.
 *
 * @returns A base WorkflowTag component.
 */
export const BaseWorkflowTag = styled.div`
    align-items: center;
    background-color: ${props => props.theme.color.purpleDarkest};
    color: ${props => props.theme.color.white};
    display: flex;
    font-size: ${getFontSize("sm")};
    font-weight: bold;
    padding: 3px 8px;

    &:first-child {
        border-top-left-radius: ${borderRadius.sm};
        border-bottom-left-radius: ${borderRadius.sm};
    }

    &:last-child {
        border-top-right-radius: ${borderRadius.sm};
        border-bottom-right-radius: ${borderRadius.sm};
    }

    &:not(:last-child) {
        border-right: 2px solid ${props => props.theme.color.purple};
    }

    i.fas {
        line-height: inherit;
    }

    span:last-child {
        margin-left: 3px;
    }
`;
