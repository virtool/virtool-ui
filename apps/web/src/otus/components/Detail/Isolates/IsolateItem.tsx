import { formatIsolateName } from "@app/utils";
import Icon from "@base/Icon";
import IconButton from "@base/IconButton";
import Link from "@base/Link";
import type { OtuIsolate } from "@otus/types";
import { Star, Trash } from "lucide-react";

type IsolateItemProps = {
	/** The isolate to display */
	isolate: OtuIsolate;
	/** The parent reference id */
	refId: string;
	/** The parent OTU id */
	otuId: string;
	/** Whether the remove control should be shown */
	canRemove: boolean;
	/** Called with the isolate when its remove control is clicked */
	onRemove: (isolate: OtuIsolate) => void;
};

/**
 * A condensed isolate item for use in a list of isolates
 */
export default function IsolateItem({
	isolate,
	refId,
	otuId,
	canRemove,
	onRemove,
}: IsolateItemProps) {
	return (
		<div className="flex items-center h-full border-b border-gray-100 pr-2 hover:bg-gray-50">
			<Link
				to="/refs/$refId/otus/$otuId/isolates/$isolateId"
				params={{ refId, otuId, isolateId: isolate.id }}
				className="flex flex-1 items-center min-w-0 h-full py-3 px-6 text-inherit"
			>
				<span className="truncate font-medium">
					{formatIsolateName(isolate)}
				</span>
				{isolate.default && <Icon icon={Star} className="ml-2" />}
			</Link>
			{canRemove && (
				<IconButton
					IconComponent={Trash}
					color="red"
					tip="remove isolate"
					onClick={() => onRemove(isolate)}
				/>
			)}
		</div>
	);
}
