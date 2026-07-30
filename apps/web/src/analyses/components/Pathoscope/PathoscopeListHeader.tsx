import Button from "@base/Button";
import Checkbox from "@base/Checkbox";
import Icon from "@base/Icon";
import * as Sentry from "@sentry/tanstackstart-react";
import { Check, ClipboardPlus } from "lucide-react";
import { useEffect, useState } from "react";

type PathoscopeListHeaderProps = {
	/** Whether every, some, or no hit is selected */
	checked: boolean | "indeterminate";

	/** The number of hits shown */
	found: number;

	/** Copies the selected hits to the clipboard */
	onCopy: () => Promise<void>;

	/** Callback to select or deselect every hit */
	onSelectAll: () => void;

	/** The number of selected hits, which the actions apply to */
	selectedCount: number;
};

/**
 * The header for the pathoscope hit list. Shows the hit count until hits are
 * selected, then swaps in the actions that apply to the selection.
 */
export default function PathoscopeListHeader({
	checked,
	found,
	onCopy,
	onSelectAll,
	selectedCount,
}: PathoscopeListHeaderProps) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) {
			return;
		}

		const timeout = setTimeout(() => setCopied(false), 2000);

		return () => clearTimeout(timeout);
	}, [copied]);

	// Only a resolved write flips the label, so a rejected one — a revoked
	// permission, an unfocused document — cannot claim the table was copied.
	function handleCopy() {
		onCopy().then(
			() => setCopied(true),
			(error) =>
				Sentry.captureException(error, {
					tags: { clipboard: "pathoscope-table" },
				}),
		);
	}

	return (
		<div className="flex items-center gap-4 border border-gray-300 mb-2.5 bg-gray-50 px-4 h-14 text-sm font-medium text-gray-600">
			<Checkbox
				ariaLabel="Select all hits"
				checked={checked}
				id="PathoscopeSelectAll"
				onClick={onSelectAll}
			/>
			<span>
				{selectedCount
					? `${selectedCount} selected`
					: `${found} ${found === 1 ? "hit" : "hits"}`}
			</span>
			{selectedCount > 0 && (
				<div className="ml-auto flex items-center gap-2">
					{/* The clipboard API is unavailable outside a secure context. */}
					{window.isSecureContext && (
						<Button size="small" onClick={handleCopy}>
							<Icon icon={copied ? Check : ClipboardPlus} />{" "}
							{copied ? "Copied" : "Copy"}
						</Button>
					)}
				</div>
			)}
		</div>
	);
}
