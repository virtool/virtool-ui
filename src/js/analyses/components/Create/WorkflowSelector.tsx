import { map } from "lodash";
import React from "react";
import styled from "styled-components";
import { getColor, getFontWeight } from "../../../app/theme";
import { Box } from "../../../base";
import { CreateAnalysisField } from "./CreateAnalysisField";
import { CreateAnalysisFieldTitle } from "./CreateAnalysisFieldTitle";
import { workflow } from "./workflows";

const WorkflowAnalysisField = styled(CreateAnalysisField)`
    display: flex;
    flex-direction: column;
`;

const StyledWorkflowSelector = styled.div`
    display: flex;
    justify-content: space-evenly;

    div:not(:last-child) {
        border-right: none;
    }
`;

type WorkflowItemProps = {
    selected: boolean;
};

const WorkflowItem = styled(Box)<WorkflowItemProps>`
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    border-radius: 0;
    margin-bottom: 0;

    background-color: ${props => getColor({ theme: props.theme, color: props.selected ? "blue" : "white" })};
    color: ${props => getColor({ theme: props.theme, color: props.selected ? "white" : "black" })};
    font-weight: ${props => getFontWeight(props.selected ? "thick" : "normal")(props)};
    border: 1px solid ${props => getColor({ theme: props.theme, color: props.selected ? "blue" : "greyLight" })};

    :hover {
        background-color: ${props => getColor({ theme: props.theme, color: props.selected ? "blue" : "greyHover" })};
    }
`;

type WorkflowSelectorProps = {
    onSelect: (selected: string) => void;
    selected: string;
    workflows: workflow[];
};

export function WorkflowSelector({ onSelect, selected, workflows }: WorkflowSelectorProps) {
    return (
        <WorkflowAnalysisField>
            <CreateAnalysisFieldTitle>Workflow </CreateAnalysisFieldTitle>{" "}
            <StyledWorkflowSelector>
                {map(workflows, workflow => (
                    <WorkflowItem
                        key={workflow.id}
                        selected={selected === workflow.id}
                        onClick={() => onSelect(workflow.id)}
                    >
                        {workflow.name}
                    </WorkflowItem>
                ))}
            </StyledWorkflowSelector>
        </WorkflowAnalysisField>
    );
}
