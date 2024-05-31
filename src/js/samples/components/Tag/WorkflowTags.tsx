import { reduce } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getWorkflowDisplayName } from "../../../utils/utils";
import { SampleWorkflows, WorkflowState } from "../../types";
import { WorkflowTag } from "./WorkflowTag";
import { WorkflowTagLink } from "./WorkflowTagLink";
import { WorkflowTagNone } from "./WorkflowTagNone";

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
 * Workflow tags for a sample item
 *
 * The tags show the state of every analysis workflow associated with the sample.
 *
 *
 * @param id - the sample's id
 * @param workflows - the workflows object for the sample
 * @returns The workflow tags for a sample.
 */
export function WorkflowTags({ id, workflows }: SampleItemWorkflowTagsProps) {
    const workflowTags = reduce(
        workflows,
        (tags, value, key) => {
            if (value === WorkflowState.COMPLETE || value === WorkflowState.PENDING) {
                tags.push(<WorkflowTag key={key} displayName={getWorkflowDisplayName(key)} workflowState={value} />);
            }
            return tags;
        },
        [],
    );
    return (
        <StyledSampleWorkflowTags>
            <SampleItemWorkflowTagsContainer>
                <WorkflowTagLink id={id} />
                {!workflowTags.length && <WorkflowTagNone />}
                {workflowTags}
            </SampleItemWorkflowTagsContainer>
        </StyledSampleWorkflowTags>
    );
}
