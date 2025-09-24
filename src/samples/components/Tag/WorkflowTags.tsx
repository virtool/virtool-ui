import { getWorkflowDisplayName } from "@app/utils";
import Icon from "@base/Icon";
import { SampleWorkflows, WorkflowState } from "@samples/types";
import { reduce } from "lodash-es";
import React from "react";
import { Link } from "wouter";
import { BaseWorkflowTag } from "./BaseWorkflowTag";
import WorkflowTag from "./WorkflowTag";

type WorkflowTagsProps = {
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
export default function WorkflowTags({ id, workflows }: WorkflowTagsProps) {
    const workflowTags = reduce(
        workflows,
        (tags, value, key) => {
            if (
                value === WorkflowState.COMPLETE ||
                value === WorkflowState.PENDING
            ) {
                tags.push(
                    <WorkflowTag
                        key={key}
                        displayName={getWorkflowDisplayName(key)}
                        workflowState={value}
                    />,
                );
            }
            return tags;
        },
        [],
    );
    return (
        <div className="flex items-center">
            <div className="flex items-stretch">
                <BaseWorkflowTag
                    as={Link}
                    className="bg-purple-400 border-purple-400 border-l-0"
                    to={`/samples/${id}/analyses`}
                >
                    View
                </BaseWorkflowTag>
                {!workflowTags.length && (
                    <BaseWorkflowTag className="bg-purple-50 border border-purple-400 text-purple-900 gap-3 [&_span:last-child]:ml-0">
                        <Icon name="times-circle" fixedWidth />
                        <span>No Analyses</span>
                    </BaseWorkflowTag>
                )}
                {workflowTags}
            </div>
        </div>
    );
}
