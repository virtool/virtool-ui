import React from "react";
import { Icon, Loader } from "../../../base";
import { WorkflowState } from "../../types";
import { SampleItemLabelIcon } from "./Icon";
import { SampleItemTag } from "./Tag";

type SampleItemWorkflowTagProps = {
    displayName: string;
    workflowState: WorkflowState;
};

/**
 * Renders a workflow tag for a sample item.
 * @param displayName {string} the display name of the workflow
 * @param workflowState {WorkflowState} current state of the workflow
 * @returns {React.FunctionComponent}
 */
export function SampleItemWorkflowTag({ displayName, workflowState }: SampleItemWorkflowTagProps) {
    return (
        <SampleItemTag>
            <SampleItemLabelIcon>
                {workflowState === WorkflowState.PENDING ? (
                    <Loader size="10px" color="white" />
                ) : (
                    <Icon name="check-circle" style={{ lineHeight: "inherit" }} fixedWidth />
                )}
            </SampleItemLabelIcon>
            <span>{displayName}</span>
        </SampleItemTag>
    );
}
