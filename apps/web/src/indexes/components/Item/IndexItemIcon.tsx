import Icon from "@base/Icon";
import Loader from "@base/Loader";
import { CircleCheck } from "lucide-react";

type IndexItemIconProps = {
	activeId?: number;
	id: number;
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
				<Icon icon={CircleCheck} color="green" />
			) : (
				<Loader className="size-5" />
			)}
			<span className="font-medium">{ready ? "Active" : "Building"}</span>
		</div>
	);
}
