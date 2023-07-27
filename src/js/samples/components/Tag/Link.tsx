import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { SampleItemTag } from "./Tag";

const StyledSampleItemWorkflowTagLink = styled(SampleItemTag)`
    background-color: ${props => props.theme.color.purple};
    border: 1px solid ${props => props.theme.color.purple};
    border-left: none;
`;

/**
 * Renders a tag to link to the analyses page for a sample.
 *
 * @returns {React.FunctionComponent}
 */
export function SampleItemWorkflowTagLink({ id }: { id: string }) {
    return (
        <StyledSampleItemWorkflowTagLink as={Link} to={`/samples/${id}/analyses`}>
            View
        </StyledSampleItemWorkflowTagLink>
    );
}
