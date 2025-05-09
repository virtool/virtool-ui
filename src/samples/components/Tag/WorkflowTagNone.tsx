import Icon from "@base/Icon";
import React from "react";
import styled from "styled-components";
import { BaseWorkflowTag } from "./BaseWorkflowTag";
import { WorkflowLabelIcon } from "./WorkflowLabelIcon";

const StyledSampleItemWorkflowTagNone = styled(BaseWorkflowTag)`
    background-color: ${(props) => props.theme.color.purpleLightest};
    border: 1px solid ${(props) => props.theme.color.purple};
    color: ${(props) => props.theme.color.purpleDarkest};
`;

/**
 * A workflow tag for showing that a sample item has no analyses.
 *
 * @returns A workflow tag for a sample item with no analyses.
 */
export default function WorkflowTagNone() {
    return (
        <StyledSampleItemWorkflowTagNone>
            <WorkflowLabelIcon>
                <Icon name="times-circle" fixedWidth />
            </WorkflowLabelIcon>
            <span>No Analyses</span>
        </StyledSampleItemWorkflowTagNone>
    );
}
