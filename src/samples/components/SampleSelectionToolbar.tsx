import Button from "@base/Button";
import Icon from "@base/Icon";
import { AreaChart } from "lucide-react";

type SampleSelectionToolbarProps = {
	/** A callback function to clear selected samples */
	onClear: () => void;
	/** A list of selected samples */
	selected: string[];
	setOpenQuickAnalyze: (open: boolean) => void;
};

/**
 * A toolbar allowing users to create an analysis for selected samples
 */
export default function SampleSelectionToolbar({
	onClear,
	selected,
	setOpenQuickAnalyze,
}: SampleSelectionToolbarProps) {
	return (
		<div className="flex items-center mb-4 [&_button]:h-10 [&_button:first-child]:flex [&_button:first-child]:flex-1 [&_button:first-child]:items-center [&_button:first-child]:justify-start [&_button:first-child]:mr-0.5">
			<Button onClick={onClear}>
				Clear selection of {selected.length} samples
			</Button>
			<Button color="green" onClick={() => setOpenQuickAnalyze(true)}>
				<Icon icon={AreaChart} /> Quick Analyze
			</Button>
		</div>
	);
}
