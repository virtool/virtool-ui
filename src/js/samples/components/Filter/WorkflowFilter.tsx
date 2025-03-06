import { getWorkflowDisplayName } from "@/utils";
import Box from "@base/Box";
import { Icon, SidebarHeader, SideBarSection } from "@base/index";
import { xor } from "lodash-es";
import React from "react";
import styled from "styled-components";
import { getBorder, getFontSize } from "../../../app/theme";
import { workflowStates } from "../../utils";

const WorkflowFilterLabel = styled.div`
    padding: 4px 8px;
`;

const StyledWorkflowFilterControlButton = styled.button`
    align-items: center;
    background-color: ${(props) =>
        props.theme.color[
            props["aria-pressed"] === true ? "purple" : "purpleLightest"
        ]};
    color: ${(props) =>
        props.theme.color[
            props["aria-pressed"] === true ? "white" : "purpleDark"
        ]};

    border: 2px solid ${(props) => props.theme.color.purple};
    border-radius: 20px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    height: 30px;
    transform: scale(
        ${(props) => (props["aria-pressed"] === "true" ? 1 : 0.95)}
    );
    width: 30px;

    i {
        font-size: ${getFontSize("md")};
    }

    &[aria-pressed="false"]:hover,
    &[aria-pressed="false"]:focus {
        background-color: ${(props) => props.theme.color.purpleLight};
        color: ${(props) => props.theme.color.purpleDarkest};
        outline: none;
    }
`;

type WorkflowFilterControlButtonProps = {
    /* Indicates if the button is active */
    active: boolean;
    /* Icon to display on the button */
    icon: string;
    /* The value to pass to the onClick handler */
    value: string;
    /* Handles click event when icon is clicked */
    onClick: (value: string) => void;
};

function WorkflowFilterControlButton({
    active,
    icon,
    value,
    onClick,
}: WorkflowFilterControlButtonProps) {
    return (
        <StyledWorkflowFilterControlButton
            aria-pressed={active}
            onClick={() => onClick(value)}
        >
            <Icon name={icon} />
        </StyledWorkflowFilterControlButton>
    );
}

const WorkflowFilterControlPath = styled.div`
    border: ${getBorder};
    flex: 1 0 auto;
    height: 2px;
`;

const WorkflowFilterControlButtons = styled.div`
    align-items: center;
    display: flex;
    justify-content: stretch;
    padding: 4px 8px 8px;
`;

const StyledWorkflowFilterControl = styled(Box)`
    background: ${(props) => props.theme.color.white};
    padding: 0;
`;

type WorkflowFilterControlProps = {
    /* The workflow to filter */
    workflow: string;
    /* Active states of filter buttons */
    states: string[];
    /* Handles click event when filter button is clicked */
    onChange: (workflow: string, state: string) => void;
};

function WorkflowFilterControl({
    workflow,
    states,
    onChange,
}: WorkflowFilterControlProps) {
    function handleClick(state) {
        onChange(workflow, state);
    }

    return (
        <StyledWorkflowFilterControl>
            <WorkflowFilterLabel>
                {getWorkflowDisplayName(workflow)}
            </WorkflowFilterLabel>
            <WorkflowFilterControlButtons>
                <WorkflowFilterControlButton
                    active={states.includes(workflowStates.NONE)}
                    icon="times"
                    value={workflowStates.NONE}
                    onClick={handleClick}
                />
                <WorkflowFilterControlPath />
                <WorkflowFilterControlButton
                    active={states.includes(workflowStates.PENDING)}
                    icon="running"
                    value={workflowStates.PENDING}
                    onClick={handleClick}
                />
                <WorkflowFilterControlPath />
                <WorkflowFilterControlButton
                    active={states.includes(workflowStates.READY)}
                    icon="check"
                    value={workflowStates.READY}
                    onClick={handleClick}
                />
            </WorkflowFilterControlButtons>
        </StyledWorkflowFilterControl>
    );
}

function getWorkflowsFromURL(workflows) {
    return workflows.reduce(
        (acc, item) => {
            const [workflow, state] = item.split(":");

            acc[workflow] = acc[workflow] || [];

            acc[workflow].push(state);
            return acc;
        },
        { pathoscope: [], nuvs: [] },
    );
}

type WorkflowFilterProps = {
    /* List of selected workflows */
    selected: string[];
    /* Handles click event when filter control is clicked */
    onClick: (selected: string[]) => void;
};

export default function WorkflowFilter({
    selected,
    onClick,
}: WorkflowFilterProps) {
    function handleClick(workflow, state) {
        onClick(xor(selected, [`${workflow}:${state}`]));
    }

    const workflows = getWorkflowsFromURL(selected);

    const { nuvs, pathoscope } = workflows;

    return (
        <SideBarSection>
            <SidebarHeader>Workflows</SidebarHeader>
            <WorkflowFilterControl
                workflow="pathoscope"
                states={pathoscope}
                onChange={handleClick}
            />
            <WorkflowFilterControl
                workflow="nuvs"
                states={nuvs}
                onChange={handleClick}
            />
        </SideBarSection>
    );
}
