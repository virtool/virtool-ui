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

	/** The number of hits before the search and filters narrowed them */
	total: number;
};

/**
 * The count of what is on screen, against the whole list when something is
 * being held back.
 *
 * The hidden hits are the ones a reader cannot see to ask about, so the total
 * is what says they exist. It is left out entirely when nothing is hidden,
 * rather than saying so — a permanent "matching filters" would be noise on a
 * list that is showing everything.
 */
function describeCount(found: number, total: number): string {
	if (found === total) {
		return `${found} ${found === 1 ? "hit" : "hits"}`;
	}

	return `${found} of ${total} hits`;
}

/**
 * The header for the pathoscope hit list. Carries the hit count, and the
 * actions that apply to a selection once there is one.
 */
export default function PathoscopeListHeader({
	checked,
	found,
	onCopy,
	onSelectAll,
	selectedCount,
	total,
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
		<div className="flex items-center gap-4 border border-gray-300 mb-2.5 rounded-sm bg-gray-50 px-4 h-14 text-sm font-medium text-gray-600">
			<Checkbox
				ariaLabel="Select all hits"
				checked={checked}
				id="PathoscopeSelectAll"
				onClick={onSelectAll}
			/>
			{/* The count stays put once hits are selected. It is the only statement
			    of how long the list is, and the selection is measured against it. */}
			<span>
				{selectedCount
					? `${selectedCount} selected · ${describeCount(found, total)}`
					: describeCount(found, total)}
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
