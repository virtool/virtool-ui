import { cn } from "@app/utils";
import Icon from "@base/Icon";
import type { Upload } from "@uploads/types";
import { ArrowLeftRight, TriangleAlert } from "lucide-react";

type ReadSlotProps = {
	label: string;
	sub: string;
	/** The selected file id for this slot, if any */
	id?: number;
	/** Loaded uploads used to resolve the file name */
	items: Upload[];
	/** Placeholder shown when the slot is empty */
	placeholder: string;
};

function ReadSlot({ label, sub, id, items, placeholder }: ReadSlotProps) {
	const file = id === undefined ? undefined : items.find((it) => it.id === id);
	const missing = id !== undefined && file === undefined;

	return (
		<div
			className={cn(
				"flex-1 min-w-0 rounded-md border p-3",
				missing ? "border-amber-400 bg-amber-50" : "border-gray-300",
			)}
		>
			<div className="text-xs font-bold text-gray-500 tracking-wide">
				{label}
				<span className="ml-1 font-medium text-gray-500">{sub}</span>
			</div>
			{file && (
				<div className="truncate font-mono font-medium mt-1">{file.name}</div>
			)}
			{missing && (
				<div className="flex items-center gap-1.5 mt-1 text-amber-600 font-medium">
					<Icon icon={TriangleAlert} size={16} />
					This file is no longer available
				</div>
			)}
			{id === undefined && (
				<div className="mt-1 text-gray-500">{placeholder}</div>
			)}
		</div>
	);
}

type ReadSelectorSlotsProps = {
	/** The current selection, in [LEFT, RIGHT] order */
	selected: number[];
	/** Loaded uploads used to resolve file names */
	items: Upload[];
	/** Reverses the LEFT and RIGHT reads */
	onSwap: () => void;
	/** Whether to show the swap control (Manual mode only) */
	showSwap: boolean;
};

/**
 * The two ordered LEFT / RIGHT slots showing the current read selection. One
 * filled slot is a single-end sample; two is paired-end. In Manual mode a
 * control to swap their order is shown; Auto-pair assigns order from detection
 * and needs no swap.
 */
export default function ReadSelectorSlots({
	selected,
	items,
	onSwap,
	showSwap,
}: ReadSelectorSlotsProps) {
	return (
		<div className="flex items-center gap-2 mb-4">
			<ReadSlot
				label="LEFT"
				sub="R1"
				id={selected[0]}
				items={items}
				placeholder="No file selected"
			/>
			{showSwap && (
				<button
					type="button"
					aria-label="Swap reads"
					disabled={selected.length < 2}
					onClick={onSwap}
					className={cn(
						"shrink-0 rounded-md border border-gray-300 p-2 text-gray-600",
						"hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-transparent",
						"focus:outline-none focus:ring-2 focus:ring-blue-600/50",
					)}
				>
					<Icon icon={ArrowLeftRight} size={18} />
				</button>
			)}
			<ReadSlot
				label="RIGHT"
				sub="R2"
				id={selected[1]}
				items={items}
				placeholder="Optional — add a second file for paired reads"
			/>
		</div>
	);
}
