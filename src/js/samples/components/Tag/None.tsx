import React from "react";
import styled from "styled-components";
import { Icon } from "../../../base";
import { SampleItemLabelIcon } from "./Icon";
import { SampleItemTag } from "./Tag";

const StyledSampleItemWorkflowTagNone = styled(SampleItemTag)`
    background-color: ${props => props.theme.color.purpleLightest};
    border: 1px solid ${props => props.theme.color.purple};
    color: ${props => props.theme.color.purpleDarkest};
`;

/**
 * Renders a tag to indicate that a sample has no analyses.
 *
 * @returns {React.FunctionComponent}
 */
export function SampleItemWorkflowTagNone() {
    return (
        <StyledSampleItemWorkflowTagNone>
            <SampleItemLabelIcon>
                <Icon name="times-circle" fixedWidth />
            </SampleItemLabelIcon>
            <span>No Analyses</span>
        </StyledSampleItemWorkflowTagNone>
    );
}
