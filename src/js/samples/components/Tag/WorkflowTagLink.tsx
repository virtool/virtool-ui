import React from "react";
import styled from "styled-components";
import { Link } from "@base";
import { BaseWorkflowTag } from "./BaseWorkflowTag";

const StyledSampleItemWorkflowTagLink = styled(BaseWorkflowTag)`
    background-color: ${props => props.theme.color.purple};
    border: 1px solid ${props => props.theme.color.purple};
    border-left: none;
`;

/**
 * A link to the analyses page which is visually consistent with workflow tags.
 *
 * @param id - the sample id
 * @returns A stylized link to the analyses page for a sample.
 */
export function WorkflowTagLink({ id }: { id: string }) {
    return (
        <StyledSampleItemWorkflowTagLink as={Link} to={`/samples/${id}/analyses`}>
            View
        </StyledSampleItemWorkflowTagLink>
    );
}
