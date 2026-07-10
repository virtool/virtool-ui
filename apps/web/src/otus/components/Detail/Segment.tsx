import BoxGroupSection from "@base/BoxGroupSection";
import IconButton from "@base/IconButton";
import Label from "@base/Label";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { OtuSegment } from "@otus/types";
import { GripVertical, Pencil, Trash } from "lucide-react";

type SegmentProps = {
	/** Whether the user has permission to modify the otu */
	canModify: boolean;
	/** A callback fired when the user requests segment removal */
	onRemove: () => void;
	segment: OtuSegment;
	setEditSegmentName: (name: string) => void;
};

/**
 * A condensed segment item for use in a list of segments
 */
export default function Segment({
	canModify,
	onRemove,
	segment,
	setEditSegmentName,
}: SegmentProps) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id: segment.name, disabled: !canModify });

	return (
		<BoxGroupSection
			ref={setNodeRef}
			className="flex items-center gap-3 h-12"
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
			}}
		>
			{canModify && (
				<IconButton
					IconComponent={GripVertical}
					color="grayDark"
					tip="drag to reorder"
					className="cursor-grab active:cursor-grabbing"
					{...attributes}
					{...listeners}
				/>
			)}

			<strong className="flex-1 truncate">{segment.name}</strong>

			<div className="w-20 flex justify-start">
				{segment.required ? (
					<Label color="purple">Required</Label>
				) : (
					<Label>Optional</Label>
				)}
			</div>

			{canModify && (
				<div className="flex">
					<IconButton
						IconComponent={Pencil}
						color="grayDark"
						tip="edit segment"
						onClick={() => setEditSegmentName(segment.name)}
					/>
					<IconButton
						IconComponent={Trash}
						color="red"
						tip="remove segment"
						onClick={onRemove}
					/>
				</div>
			)}
		</BoxGroupSection>
	);
}
