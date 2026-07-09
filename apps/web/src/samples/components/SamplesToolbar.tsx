import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import InputSearch from "@base/InputSearch";
import LinkButton from "@base/LinkButton";
import Toolbar from "@base/Toolbar";
import type { Label } from "@labels/types";
import type { ChangeEvent } from "react";
import LabelFilterDropdown from "./Filter/LabelFilterDropdown";
import WorkflowFilterDropdown from "./Filter/WorkflowFilterDropdown";
import SampleSelectionToolbar from "./SampleSelectionToolbar";

type SampleSearchToolbarProps = {
	/** All available labels. */
	labels: Label[];

	onChange: (e: ChangeEvent<HTMLInputElement>) => void;

	/** Deselects every label. */
	onClearLabels: () => void;

	/** Deselects every workflow state. */
	onClearWorkflows: () => void;

	/** Toggles a single label. */
	onToggleLabel: (labelId: number) => void;

	/** Toggles a single ``workflow:state`` filter. */
	onToggleWorkflow: (value: string) => void;

	/** Selected label IDs. */
	selectedLabels: number[];

	/** Selected ``workflow:state`` filters. */
	selectedWorkflows: string[];

	term: string;
};

function SampleSearchToolbar({
	labels,
	onChange,
	onClearLabels,
	onClearWorkflows,
	onToggleLabel,
	onToggleWorkflow,
	selectedLabels,
	selectedWorkflows,
	term,
}: SampleSearchToolbarProps) {
	const { hasPermission: canCreate } =
		useCheckAdminRoleOrPermission("create_sample");

	return (
		<Toolbar>
			<div className="flex-grow">
				<InputSearch
					value={term || ""}
					onChange={onChange}
					placeholder="Sample name"
				/>
			</div>
			<LabelFilterDropdown
				labels={labels}
				onClear={onClearLabels}
				onToggle={onToggleLabel}
				selected={selectedLabels}
			/>
			<WorkflowFilterDropdown
				onClear={onClearWorkflows}
				onToggle={onToggleWorkflow}
				selected={selectedWorkflows}
			/>
			{canCreate && (
				<LinkButton color="blue" to="/samples/create">
					Create
				</LinkButton>
			)}
		</Toolbar>
	);
}

type SampleToolbarProps = SampleSearchToolbarProps & {
	/** A callback function to clear selected samples */
	onClear: () => void;

	/** A callback to open a quick analysis scoped to the selected samples */
	onQuickAnalyze: () => void;

	/** A list of selected samples */
	selected: string[];
};

/**
 * A toolbar allowing samples to be filtered by name and to create an analysis for selected samples
 */
export default function SampleToolbar({
	labels,
	selected,
	onClear,
	onClearLabels,
	onClearWorkflows,
	onChange,
	onQuickAnalyze,
	onToggleLabel,
	onToggleWorkflow,
	selectedLabels,
	selectedWorkflows,
	term,
}: SampleToolbarProps) {
	return selected.length ? (
		<SampleSelectionToolbar
			selected={selected}
			onClear={onClear}
			onQuickAnalyze={onQuickAnalyze}
		/>
	) : (
		<SampleSearchToolbar
			labels={labels}
			onChange={onChange}
			onClearLabels={onClearLabels}
			onClearWorkflows={onClearWorkflows}
			onToggleLabel={onToggleLabel}
			onToggleWorkflow={onToggleWorkflow}
			selectedLabels={selectedLabels}
			selectedWorkflows={selectedWorkflows}
			term={term}
		/>
	);
}
