import Icon from "@base/Icon";
import Loader from "@base/Loader";
import type { WorkflowState } from "@samples/types";
import { CheckCircle } from "lucide-react";
import { BaseWorkflowTag } from "./BaseWorkflowTag";

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
			<span className="w-3.5">
				{workflowState === "pending" ? (
					<Loader className="size-2.5" color="gray" />
				) : (
					<Icon icon={CheckCircle} className="size-3.5" />
				)}
			</span>
			<span>{displayName}</span>
		</BaseWorkflowTag>
	);
}
