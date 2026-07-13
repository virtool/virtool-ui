import BoxGroupSection from "@base/BoxGroupSection";
import Button from "@base/Button";
import Checkbox from "@base/Checkbox";
import Icon from "@base/Icon";
import { Trash } from "lucide-react";
import type { ReactNode } from "react";

type UploadListHeaderProps = {
	/** Extra actions applying to the selection, shown before Delete */
	action?: ReactNode;

	/** Whether the files can be deleted, which the Delete action requires */
	canDelete: boolean;

	/** Whether every, some, or no file on the page is selected */
	checked: boolean | "indeterminate";

	/** The number of files of this type */
	found: number;

	/** Callback to delete every selected file */
	onDelete: () => void;

	/** Callback to select or deselect every file on the page */
	onSelectAll: () => void;

	/** The number of selected files, which the actions apply to */
	selectedCount: number;
};

/**
 * The header for the file list. Shows the file count until files are selected,
 * then swaps in the actions that apply to the selection.
 */
export default function UploadListHeader({
	action,
	canDelete,
	checked,
	found,
	onDelete,
	onSelectAll,
	selectedCount,
}: UploadListHeaderProps) {
	return (
		<BoxGroupSection className="flex items-center gap-4 bg-gray-50 h-14 py-0 text-sm font-medium text-gray-600">
			<Checkbox
				ariaLabel="Select all files"
				checked={checked}
				id="UploadSelectAll"
				onClick={onSelectAll}
			/>
			<span>
				{selectedCount
					? `${selectedCount} selected`
					: `${found} ${found === 1 ? "file" : "files"}`}
			</span>
			{selectedCount > 0 && (
				<div className="ml-auto flex items-center gap-2">
					{action}
					{canDelete && (
						<Button color="red" size="small" onClick={onDelete}>
							<Icon icon={Trash} /> Delete
						</Button>
					)}
				</div>
			)}
		</BoxGroupSection>
	);
}
