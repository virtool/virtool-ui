import React from "react";
import styled from "styled-components";
import { Icon } from "../../../base";
import { BaseWorkflowTag } from "./BaseWorkflowTag";
import { WorkflowLabelIcon } from "./WorkflowLabelIcon";

const StyledSampleItemWorkflowTagNone = styled(BaseWorkflowTag)`
    background-color: ${props => props.theme.color.purpleLightest};
    border: 1px solid ${props => props.theme.color.purple};
    color: ${props => props.theme.color.purpleDarkest};
`;

/**
 * Display a "no analyses" tag.
 *
 * @returns A tag for a sample item with no analyses.
 */
export function WorkflowTagNone() {
    return (
        <StyledSampleItemWorkflowTagNone>
            <WorkflowLabelIcon>
                <Icon name="times-circle" fixedWidth />
            </WorkflowLabelIcon>
            <span>No Analyses</span>
        </StyledSampleItemWorkflowTagNone>
    );
}
