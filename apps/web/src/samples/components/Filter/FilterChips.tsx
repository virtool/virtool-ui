import type { Label } from "@labels/types";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type FilterChipProps = {
	children: ReactNode;
	onRemove: () => void;
	removeLabel: string;
};

function FilterChip({ children, onRemove, removeLabel }: FilterChipProps) {
	return (
		<span className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-2 py-0.5 text-sm">
			{children}
			<button
				aria-label={removeLabel}
				className="cursor-pointer text-gray-400 hover:text-gray-700"
				onClick={onRemove}
				type="button"
			>
				<X size={14} />
			</button>
		</span>
	);
}

type FilterChipGroupProps = {
	children: ReactNode;
	title: string;
};

function FilterChipGroup({ children, title }: FilterChipGroupProps) {
	return (
		<div className="flex items-center gap-2">
			<span className="font-medium text-gray-500 text-sm">{title}</span>
			<span className="h-4 w-px bg-gray-300" />
			<div className="flex flex-wrap items-center gap-1.5">{children}</div>
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

	/** Selected label IDs. */
	selectedLabels: number[];

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
	selectedLabels,
	term,
}: FilterChipsProps) {
	const selected = labels.filter((label) => selectedLabels.includes(label.id));

	if (!term && selected.length === 0) {
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
								className="size-2.5 rounded-full"
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
		</div>
	);
}
