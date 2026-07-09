import WorkflowFilter from "./WorkflowFilter";

type SampleFilterProps = {
	/** Handles click event when workflow is clicked */
	onClickWorkflows: (value: string[]) => void;

	/** A list of selected workflows */
	selectedWorkflows: string[];
};

/**
 * Filter samples by workflows
 */
export default function SampleFilters({
	onClickWorkflows,
	selectedWorkflows,
}: SampleFilterProps) {
	return (
		<div className="col-start-2 row-start-2">
			<WorkflowFilter selected={selectedWorkflows} onClick={onClickWorkflows} />
		</div>
	);
}
