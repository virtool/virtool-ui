import { getWorkflowDisplayName } from "@app/utils";
import type { Label } from "@labels/types";
import {
	formatWorkflowFilter,
	getWorkflowFilterStateDisplayName,
	parseWorkflowFilters,
} from "@samples/utils";
import type { ReactNode } from "react";

type FilterChipProps = {
	children: ReactNode;
	onRemove: () => void;
	removeLabel: string;
};

function FilterChip({ children, onRemove, removeLabel }: FilterChipProps) {
	return (
		<button
			aria-label={removeLabel}
			className="inline-flex cursor-pointer items-center gap-1.5 border-gray-300 border-l px-2 py-0.5 hover:bg-gray-100"
			onClick={onRemove}
			type="button"
		>
			{children}
		</button>
	);
}

type FilterChipGroupProps = {
	children: ReactNode;
	title: string;
};

function FilterChipGroup({ children, title }: FilterChipGroupProps) {
	return (
		<div className="flex items-stretch overflow-hidden rounded-md border border-gray-300 bg-white text-sm">
			<span className="flex items-center px-2 py-0.5 font-medium text-gray-500">
				{title}
			</span>
			{children}
		</div>
	);
}

type FilterChipsProps = {
	/** All available labels, used to resolve selected IDs to names and colors. */
	labels: Label[];

	/** Clears the search term. */
	onClearTerm: () => void;

	/** Deselects a single label. */
	onRemoveLabel: (labelId: number) => void;

	/** Deselects a single ``workflow:state`` filter. */
	onRemoveWorkflow: (value: string) => void;

	/** Selected label IDs. */
	selectedLabels: number[];

	/** Selected ``workflow:state`` filters. */
	selectedWorkflows: string[];

	/** The active search term. */
	term: string;
};

/**
 * A row of chips summarizing the active sample filters
 */
export default function FilterChips({
	labels,
	onClearTerm,
	onRemoveLabel,
	onRemoveWorkflow,
	selectedLabels,
	selectedWorkflows,
	term,
}: FilterChipsProps) {
	const selected = labels.filter((label) => selectedLabels.includes(label.id));
	const workflows = parseWorkflowFilters(selectedWorkflows);

	if (!term && selected.length === 0 && workflows.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3">
			{term && (
				<FilterChipGroup title="Search">
					<FilterChip onRemove={onClearTerm} removeLabel="Clear search term">
						{term}
					</FilterChip>
				</FilterChipGroup>
			)}
			{selected.length > 0 && (
				<FilterChipGroup title="Labels">
					{selected.map((label) => (
						<FilterChip
							key={label.id}
							onRemove={() => onRemoveLabel(label.id)}
							removeLabel={`Remove ${label.name} label filter`}
						>
							<span
								className="size-2.5 shrink-0 rounded-full"
								style={{
									backgroundColor: label.color.startsWith("#")
										? label.color
										: `#${label.color}`,
								}}
							/>
							{label.name}
						</FilterChip>
					))}
				</FilterChipGroup>
			)}
			{workflows.length > 0 && (
				<FilterChipGroup title="Workflows">
					{workflows.map(({ state, workflow }) => {
						const workflowName = getWorkflowDisplayName(workflow);
						const stateName = getWorkflowFilterStateDisplayName(state);

						return (
							<FilterChip
								key={formatWorkflowFilter({ state, workflow })}
								onRemove={() =>
									onRemoveWorkflow(formatWorkflowFilter({ state, workflow }))
								}
								removeLabel={`Remove ${workflowName} ${stateName} filter`}
							>
								<span className="text-gray-500">{workflowName}</span>
								{stateName}
							</FilterChip>
						);
					})}
				</FilterChipGroup>
			)}
		</div>
	);
}
