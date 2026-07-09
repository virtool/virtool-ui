import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import InputSearch from "@base/InputSearch";
import LinkButton from "@base/LinkButton";
import Toolbar from "@base/Toolbar";
import type { Label } from "@labels/types";
import type { ChangeEvent } from "react";
import LabelFilterDropdown from "./Filter/LabelFilterDropdown";
import SampleSelectionToolbar from "./SampleSelectionToolbar";

type SampleSearchToolbarProps = {
	/** All available labels. */
	labels: Label[];

	onChange: (e: ChangeEvent<HTMLInputElement>) => void;

	/** Deselects every label. */
	onClearLabels: () => void;

	/** Toggles a single label. */
	onToggleLabel: (labelId: number) => void;

	/** Selected label IDs. */
	selectedLabels: number[];

	term: string;
};

function SampleSearchToolbar({
	labels,
	onChange,
	onClearLabels,
	onToggleLabel,
	selectedLabels,
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
	onChange,
	onQuickAnalyze,
	onToggleLabel,
	selectedLabels,
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
			onToggleLabel={onToggleLabel}
			selectedLabels={selectedLabels}
			term={term}
		/>
	);
}
