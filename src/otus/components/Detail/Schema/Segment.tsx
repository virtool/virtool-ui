import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import type { OtuSegment } from "@otus/types";
import { ChevronDown, ChevronUp, Pencil, Trash } from "lucide-react";

type SegmentProps = {
	/** Whether the user has permission to modify the otu */
	canModify: boolean;
	/** Whether the segment is the first in the list */
	first: boolean;
	/** Whether the segment is the last in the list */
	last: boolean;
	/** A callback function to move the segment up */
	onMoveUp: () => void;
	/** A callback function to move the segment down */
	onMoveDown: () => void;
	segment: OtuSegment;
	setEditSegmentName: (name: string) => void;
	setRemoveSegmentName: (name: string) => void;
};

/**
 * A condensed segment item for use in a list of segments
 */
export default function Segment({
	canModify,
	first,
	last,
	onMoveUp,
	onMoveDown,
	segment,
	setEditSegmentName,
	setRemoveSegmentName,
}: SegmentProps) {
	return (
		<BoxGroupSection className="flex items-center gap-3 h-12">
			<strong className="flex-1 truncate">{segment.name}</strong>

			{segment.required ? (
				<Label color="purple">Required</Label>
			) : (
				<Label>Optional</Label>
			)}

			{canModify && (
				<div className="flex">
					<IconButton
						IconComponent={Trash}
						color="red"
						tip="remove segment"
						onClick={() => setRemoveSegmentName(segment.name)}
					/>
					<IconButton
						IconComponent={Pencil}
						color="grayDark"
						tip="edit segment"
						onClick={() => setEditSegmentName(segment.name)}
					/>
				</div>
			)}

			{(!first || !last) && (
				<div className="flex">
					{!first && (
						<IconButton
							IconComponent={ChevronUp}
							tip="move up"
							onClick={onMoveUp}
						/>
					)}
					{!last && (
						<IconButton
							IconComponent={ChevronDown}
							tip="move down"
							onClick={onMoveDown}
						/>
					)}
				</div>
			)}
		</BoxGroupSection>
	);
}
