import Icon from "@base/Icon";
import Loader from "@base/Loader";
import React from "react";
import { WorkflowState } from "../../types";
import { BaseWorkflowTag } from "./BaseWorkflowTag";
import { WorkflowLabelIcon } from "./WorkflowLabelIcon";

type SampleItemWorkflowTagProps = {
    displayName: string;
    workflowState: WorkflowState;
};

/**
 * An inline tag for displaying the current state of a workflow.
 *
 * @param displayName - the display name of the workflow
 * @param workflowState - current state of the workflow
 * @returns A tag displaying the state of a workflow
 */
export default function WorkflowTag({
    displayName,
    workflowState,
}: SampleItemWorkflowTagProps) {
    return (
        <BaseWorkflowTag>
            <WorkflowLabelIcon>
                {workflowState === WorkflowState.PENDING ? (
                    <Loader size="10px" color="white" />
                ) : (
                    <Icon
                        name="check-circle"
                        style={{ lineHeight: "inherit" }}
                        fixedWidth
                    />
                )}
            </WorkflowLabelIcon>
            <span>{displayName}</span>
        </BaseWorkflowTag>
    );
}
