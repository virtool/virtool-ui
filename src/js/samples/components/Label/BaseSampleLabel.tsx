import styled from "styled-components";
import { borderRadius, getBorder } from "../../../app/theme";

/**
 * The base sample label component
 */
export const BaseSampleLabel = styled.span`
    align-items: center;
    background-color: ${props => props.theme.color.white};
    border: ${getBorder};
    border-radius: ${borderRadius.md};
    display: inline-flex;
    padding: 4px 8px;

    i.fas {
        color: ${props => props.color};
        margin-right: 5px;
    }
`;
