import { useCheckAdminRoleOrPermission } from "@administration/hooks";
import InputSearch from "@base/InputSearch";
import LinkButton from "@base/LinkButton";
import Toolbar from "@base/Toolbar";
import type { ChangeEvent } from "react";
import SampleSelectionToolbar from "./SampleSelectionToolbar";

type SampleSearchToolbarProps = {
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	term: string;
};

function SampleSearchToolbar({ onChange, term }: SampleSearchToolbarProps) {
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
	selected,
	onClear,
	onChange,
	onQuickAnalyze,
	term,
}: SampleToolbarProps) {
	return selected.length ? (
		<SampleSelectionToolbar
			selected={selected}
			onClear={onClear}
			onQuickAnalyze={onQuickAnalyze}
		/>
	) : (
		<SampleSearchToolbar onChange={onChange} term={term} />
	);
}
