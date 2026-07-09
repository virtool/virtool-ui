import Dropdown from "@base/Dropdown";
import DropdownButton from "@base/DropdownButton";
import DropdownMenuCheckboxItem from "@base/DropdownMenuCheckboxItem";
import DropdownMenuContent from "@base/DropdownMenuContent";
import DropdownMenuItem from "@base/DropdownMenuItem";
import DropdownMenuSeparator from "@base/DropdownMenuSeparator";
import type { Label } from "@labels/types";
import { Tag } from "lucide-react";

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
			<DropdownMenuContent className="w-64">
				{labels.length === 0 ? (
					<p className="px-2 py-1.5 text-gray-500 text-sm">
						No labels have been created.
					</p>
				) : (
					labels.map((label) => (
						<DropdownMenuCheckboxItem
							checked={selected.includes(label.id)}
							key={label.id}
							onCheckedChange={() => onToggle(label.id)}
							// Keep the menu open so several labels can be toggled at once.
							onSelect={(e) => e.preventDefault()}
						>
							<span
								className="rounded-full shrink-0 size-3"
								style={{ backgroundColor: getHexColor(label.color) }}
							/>
							<span className="flex-grow truncate">{label.name}</span>
							<span className="text-gray-400 text-sm">{label.count}</span>
						</DropdownMenuCheckboxItem>
					))
				)}
				{selected.length > 0 && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem color="blue" onSelect={onClear}>
							Clear
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</Dropdown>
	);
}
