import { updateSearchParam } from "@app/hooks";
import Button from "@base/Button";
import Icon from "@base/Icon";
import LinkButton from "@base/LinkButton";
import { AreaChart } from "lucide-react";
import { useSearch } from "wouter";

type SampleSelectionToolbarProps = {
	/** A callback function to clear selected samples */
	onClear: () => void;
	/** A list of selected samples */
	selected: string[];
};

/**
 * A toolbar allowing users to create an analysis for selected samples
 */
export default function SampleSelectionToolbar({
	onClear,
	selected,
}: SampleSelectionToolbarProps) {
	const search = useSearch();
	return (
		<div className="flex items-center mb-4 [&_button]:h-10 [&_button:first-child]:flex [&_button:first-child]:flex-1 [&_button:first-child]:items-center [&_button:first-child]:justify-start [&_button:first-child]:mr-0.5">
			<Button onClick={onClear}>
				Clear selection of {selected.length} samples
			</Button>
			<LinkButton
				color="green"
				to={updateSearchParam("openQuickAnalyze", "true", search)}
			>
				<Icon icon={AreaChart} /> Quick Analyze
			</LinkButton>
		</div>
	);
}
