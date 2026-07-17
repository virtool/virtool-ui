import DeleteDialog from "@base/DeleteDialog";
import { useUpdateOtu } from "@otus/queries";
import type { OtuSegment } from "@otus/types";

type RemoveSegmentProps = {
	abbreviation: string;
	name: string;
	open?: boolean;
	otuId: string;
	schema: OtuSegment[];
	segmentName?: string;
	setOpen?: (open: boolean) => void;
};

/**
 * Displays a dialog for removing a segment
 */
export default function RemoveSegment({
	abbreviation,
	name,
	open = false,
	otuId,
	schema,
	segmentName,
	setOpen = () => {},
}: RemoveSegmentProps) {
	const mutation = useUpdateOtu(otuId);

	function handleConfirm() {
		if (!segmentName) {
			return;
		}

		return mutation.mutateAsync({
			otuId,
			name,
			abbreviation,
			schema: schema.filter((s) => s.name !== segmentName),
		});
	}

	return (
		<DeleteDialog
			name={segmentName ?? ""}
			noun="Segment"
			onConfirm={handleConfirm}
			onOpenChange={setOpen}
			open={open}
		/>
	);
}
