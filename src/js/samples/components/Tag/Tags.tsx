import { reduce } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getWorkflowDisplayName } from "../../../utils/utils";
import { SampleWorkflows, WorkflowState } from "../../types";
import { SampleItemWorkflowTagLink } from "./Link";
import { SampleItemWorkflowTagNone } from "./None";
import { SampleItemWorkflowTag } from "./Workflow";

const StyledSampleWorkflowTags = styled.div`
    align-items: center;
    display: flex;
    flex: 2;
`;

const SampleItemWorkflowTagsContainer = styled.div`
    align-items: stretch;
    display: flex;
`;

type SampleItemWorkflowTagsProps = {
    id: string;
    workflows: SampleWorkflows;
};

/**
 * Renders a list of workflow tags for a sample item.
 *
 * @param id {string} the sample id
 * @param workflows {SampleWorkflows} the workflows object for the sample
 * @returns {React.FunctionComponent}
 */
export function SampleItemWorkflowTags({ id, workflows }: SampleItemWorkflowTagsProps) {
    const workflowTags = reduce(
        workflows,
        (tags, value, key) => {
            if (value === WorkflowState.COMPLETE || value === WorkflowState.PENDING) {
                tags.push(
                    <SampleItemWorkflowTag key={key} displayName={getWorkflowDisplayName(key)} workflowState={value} />,
                );
            }
            return tags;
        },
        [],
    );
    return (
        <StyledSampleWorkflowTags>
            <SampleItemWorkflowTagsContainer>
                <SampleItemWorkflowTagLink id={id} />
                {!workflowTags.length && <SampleItemWorkflowTagNone />}
                {workflowTags}
            </SampleItemWorkflowTagsContainer>
        </StyledSampleWorkflowTags>
    );
}
