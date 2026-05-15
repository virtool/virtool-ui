import type { Label } from "@labels/types";
import LabelFilter from "./LabelFilter";
import WorkflowFilter from "./WorkflowFilter";

type SampleFilterProps = {
	/** A list of labels */
	labels: Label[];

	/** Handles click event when label is clicked */
	onClickLabels: (value: number) => void;

	/** A list of selected labels */
	selectedLabels: number[];

	/** Handles click event when workflow is clicked */
	onClickWorkflows: (value: string[]) => void;

	/** A list of selected workflows */
	selectedWorkflows: string[];
};

/**
 * Filter samples by labels and workflows
 */
export default function SampleFilters({
	labels,
	onClickLabels,
	onClickWorkflows,
	selectedLabels,
	selectedWorkflows,
}: SampleFilterProps) {
	return (
		<div className="col-start-2 row-start-2">
			<LabelFilter
				labels={labels}
				onClick={onClickLabels}
				selected={selectedLabels}
			/>
			<WorkflowFilter selected={selectedWorkflows} onClick={onClickWorkflows} />
		</div>
	);
}
