import { Info } from "lucide-react";

export default function ArchivedRebuildAlert() {
	return (
		<div className="flex items-center gap-2 px-4 py-3 mb-4 rounded-md border border-gray-200 bg-gray-50 text-sm text-gray-600">
			<Info size={16} className="text-gray-500 shrink-0" />
			<span>
				New index builds are disabled while this reference is archived.
			</span>
		</div>
	);
}
