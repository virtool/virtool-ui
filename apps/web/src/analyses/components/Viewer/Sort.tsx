import { cn } from "@app/cn";
import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuRadioGroup from "@base/DropdownMenuRadioGroup";
import DropdownMenuRadioItem from "@base/DropdownMenuRadioItem";
import Icon from "@base/Icon";
import type { WorkflowName } from "@virtool/contracts";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const sortKeys: Record<WorkflowName, string[]> = {
	pathoscope: ["coverage", "depth", "weight"],
	nuvs: ["length", "e", "orfs"],
};

const sortTitles: Record<string, string> = {
	coverage: "Coverage",
	depth: "Depth",
	e: "E-Value",
	length: "Length",
	orfs: "ORFs",
	weight: "Weight",
	identity: "Identity",
	name: "Name",
};

type AnalysisViewerSortProps = {
	workflow: WorkflowName;
	sortKey: string;
	onSelect: (key: string) => void;
};

export function AnalysisViewerSort({
	workflow,
	sortKey,
	onSelect,
}: AnalysisViewerSortProps) {
	const keys = sortKeys[workflow] ?? [];

	// `sortKey` arrives from the URL unvalidated, so it can name a key this
	// workflow does not offer. Falling back to the first is what the pathoscope
	// hook already sorts by in that case, and it keeps the trigger from showing
	// nothing at all now that its label comes from `keys`.
	const activeKey = keys.includes(sortKey) ? sortKey : (keys[0] ?? sortKey);

	return (
		<Dropdown>
			{/* The visible label is the sort key alone — the icon says it is a sort,
			    and in the pathoscope toolbar the direction button beside it says so
			    again. The name spells it out, because "Coverage" on its own tells a
			    screen reader nothing about what the control does. */}
			<DropdownButton aria-label={`Sort by ${sortTitles[activeKey]}`}>
				<Icon icon={ArrowUpDown} />
				{/* Every key this workflow offers is stacked in one grid cell, so the
				    cell is as wide as the longest of them and picking a different key
				    cannot resize the button — which would otherwise shove the whole
				    right of the toolbar sideways. `invisible` is `visibility: hidden`,
				    which keeps the unpicked labels out of the accessibility tree as
				    well as out of sight. */}
				<span className="grid">
					{keys.map((key) => (
						<span
							className={cn(
								"col-start-1",
								"row-start-1",
								key !== activeKey && "invisible",
							)}
							key={key}
						>
							{sortTitles[key]}
						</span>
					))}
				</span>
				<Icon icon={ChevronDown} />
			</DropdownButton>
			<DropdownMenuContent>
				<DropdownMenuRadioGroup value={activeKey} onValueChange={onSelect}>
					{keys.map((key) => (
						<DropdownMenuRadioItem key={key} value={key}>
							{sortTitles[key]}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</Dropdown>
	);
}
