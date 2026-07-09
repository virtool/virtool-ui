import { cn } from "@app/utils";
import { buttonVariants } from "@base/buttonVariants";
import Popover from "@base/Popover";
import type { Label } from "@labels/types";
import { Check, Tag } from "lucide-react";

type LabelFilterDropdownProps = {
	/** All available labels. */
	labels: Label[];

	/** Deselects every label. */
	onClear: () => void;

	/** Toggles a single label. */
	onToggle: (labelId: number) => void;

	/** Selected label IDs. */
	selected: number[];
};

/**
 * A dropdown for selecting the labels that samples are filtered by
 */
export default function LabelFilterDropdown({
	labels,
	onClear,
	onToggle,
	selected,
}: LabelFilterDropdownProps) {
	return (
		<Popover
			align="end"
			trigger={
				<button className={cn(buttonVariants(), "gap-2")} type="button">
					<Tag size={16} />
					Labels
					{selected.length > 0 && (
						<span className="bg-gray-400 font-semibold px-1.5 rounded-full text-sm text-white">
							{selected.length}
						</span>
					)}
				</button>
			}
		>
			<div className="flex items-center justify-between border-b border-gray-200 px-3 py-2">
				<span className="font-medium text-sm text-gray-600">
					Filter by label
				</span>
				<button
					className="cursor-pointer text-blue-600 text-sm hover:underline disabled:cursor-default disabled:text-gray-400 disabled:no-underline"
					disabled={selected.length === 0}
					onClick={onClear}
					type="button"
				>
					Clear
				</button>
			</div>
			<div className="max-h-72 overflow-y-auto py-1">
				{labels.length === 0 ? (
					<p className="px-3 py-2 text-gray-500 text-sm">
						No labels have been created.
					</p>
				) : (
					labels.map((label) => {
						const pressed = selected.includes(label.id);

						return (
							<button
								aria-pressed={pressed}
								className={cn(
									"flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left",
									"hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none",
								)}
								key={label.id}
								onClick={() => onToggle(label.id)}
								type="button"
							>
								<span
									className="size-3 shrink-0 rounded-full"
									style={{
										backgroundColor: label.color.startsWith("#")
											? label.color
											: `#${label.color}`,
									}}
								/>
								<span className="flex-grow truncate">{label.name}</span>
								<span className="text-gray-400 text-sm">{label.count}</span>
								{pressed && <Check className="text-blue-600" size={16} />}
							</button>
						);
					})
				)}
			</div>
		</Popover>
	);
}
