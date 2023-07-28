import React from "react";
import { Icon, Loader } from "../../../base";
import { WorkflowState } from "../../types";
import { BaseWorkflowTag } from "./BaseWorkflowTag";
import { WorkflowLabelIcon } from "./WorkflowLabelIcon";

type SampleItemWorkflowTagProps = {
    displayName: string;
    workflowState: WorkflowState;
};

/**
 * Display a workflow tag
 *
 * @param displayName - the display name of the workflow
 * @param workflowState - current state of the workflow
 * @returns A workflow tag
 */
export function WorkflowTag({ displayName, workflowState }: SampleItemWorkflowTagProps) {
    return (
        <BaseWorkflowTag>
            <WorkflowLabelIcon>
                {workflowState === WorkflowState.PENDING ? (
                    <Loader size="10px" color="white" />
                ) : (
                    <Icon name="check-circle" style={{ lineHeight: "inherit" }} fixedWidth />
                )}
            </WorkflowLabelIcon>
            <span>{displayName}</span>
        </BaseWorkflowTag>
    );
}
