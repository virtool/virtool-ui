import { reduce } from "lodash-es";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { borderRadius, getFontSize } from "../../../app/theme";
import { Icon, Loader } from "../../../base";
import { SampleWorkflows, WorkflowState } from "../../types";

const SampleItemLabelIcon = styled.span`
    margin-right: 3px;
    width: 12px;
`;

const StyledSampleItemWorkflowTag = styled.div`
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

type SampleItemWorkflowTagProps = {
    label: string;
    workflowState: WorkflowState;
};

export function SampleItemWorkflowTag({ label, workflowState }: SampleItemWorkflowTagProps) {
    return (
        <StyledSampleItemWorkflowTag>
            <SampleItemLabelIcon>
                {workflowState === WorkflowState.PENDING ? (
                    <Loader size="10px" color="white" />
                ) : (
                    <Icon name="check-circle" style={{ lineHeight: "inherit" }} fixedWidth />
                )}
            </SampleItemLabelIcon>
            <span>{label}</span>
        </StyledSampleItemWorkflowTag>
    );
}

const SampleItemWorkflowTagLink = styled(StyledSampleItemWorkflowTag)`
    background-color: ${props => props.theme.color.purple};
    border: 1px solid ${props => props.theme.color.purple};
    border-left: none;
`;

const SampleItemWorkflowTagNone = styled(StyledSampleItemWorkflowTag)`
    background-color: ${props => props.theme.color.purpleLightest};
    border: 1px solid ${props => props.theme.color.purple};
    color: ${props => props.theme.color.purpleDarkest};
`;

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

const labels = { pathoscope: "Pathoscope", nuvs: "NuVs", aodp: "AODP" };
export function SampleItemWorkflowTags({ id, workflows }: SampleItemWorkflowTagsProps) {
    const workflowTags = reduce(
        workflows,
        (tags, value, key) => {
            if (value === WorkflowState.COMPLETE || value === WorkflowState.PENDING) {
                tags.push(<SampleItemWorkflowTag key={key} label={labels[key]} workflowState={value} />);
            }
            return tags;
        },
        [],
    );
    return (
        <StyledSampleWorkflowTags>
            <SampleItemWorkflowTagsContainer>
                <SampleItemWorkflowTagLink as={Link} to={`/samples/${id}/analyses`}>
                    View
                </SampleItemWorkflowTagLink>
                {!workflowTags.length && (
                    <SampleItemWorkflowTagNone>
                        <SampleItemLabelIcon>
                            <Icon name="times-circle" fixedWidth />
                        </SampleItemLabelIcon>
                        <span>No Analyses</span>
                    </SampleItemWorkflowTagNone>
                )}
                {workflowTags}
            </SampleItemWorkflowTagsContainer>
        </StyledSampleWorkflowTags>
    );
}
