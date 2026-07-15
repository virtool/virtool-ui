import Loader from "@base/Loader";
import { CircleCheck } from "lucide-react";

type IndexItemIconProps = {
	activeId?: string;
	id: string;
	ready: boolean;
};

/**
 * Icon indicating that status of the index
 *
 * @param activeId - The id of the active index
 * @param id - The id of the index
 * @param ready - Whether the index is ready
 * @returns The index item's icon
 */
export function IndexItemIcon({ activeId, id, ready }: IndexItemIconProps) {
	if (ready && id !== activeId) {
		return null;
	}

	return (
		<div className="flex items-center justify-end gap-1.5">
			{ready ? (
				<CircleCheck className="stroke-green-600" size={18} />
			) : (
				<Loader className="size-4" />
			)}
			<span className="font-medium">{ready ? "Active" : "Building"}</span>
		</div>
	);
}
