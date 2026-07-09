import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuItem from "@base/DropdownMenuItem";
import type { Label } from "@labels/types";
import { Check, Tag } from "lucide-react";

function getHexColor(color: string) {
	return color.startsWith("#") ? color : `#${color}`;
}

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
		<Dropdown>
			<DropdownButton className="gap-2">
				<Tag size={16} />
				Labels
			</DropdownButton>
			<DropdownMenuContent className="max-h-80 overflow-y-auto w-64 py-1">
				{labels.length === 0 ? (
					<p className="px-4 py-2.5 text-gray-500 text-sm">
						No labels have been created.
					</p>
				) : (
					labels.map((label) => {
						const isSelected = selected.includes(label.id);

						return (
							<DropdownMenuItem
								className="flex items-center gap-2"
								key={label.id}
								// Keep the menu open so several labels can be toggled at once.
								onSelect={(e) => {
									e.preventDefault();
									onToggle(label.id);
								}}
							>
								<span
									className="rounded-full shrink-0 size-3"
									style={{ backgroundColor: getHexColor(label.color) }}
								/>
								<span className="flex-grow truncate">{label.name}</span>
								<span className="text-gray-400 text-sm">{label.count}</span>
								{isSelected && <Check className="text-blue-600" size={16} />}
							</DropdownMenuItem>
						);
					})
				)}
				{selected.length > 0 && (
					<DropdownMenuItem
						className="border-gray-200 border-t mt-1 text-blue-600"
						onSelect={onClear}
					>
						Clear
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</Dropdown>
	);
}
