import RemoveDialog from "@base/RemoveDialog";
import { useUpdateOTU } from "@otus/queries";
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
	const mutation = useUpdateOTU(otuId);

	function handleSubmit() {
		if (!segmentName) {
			return;
		}
		mutation.mutate(
			{
				otuId,
				name,
				abbreviation,
				schema: schema.filter((s) => s.name !== segmentName),
			},
			{ onSuccess: () => setOpen(false) },
		);
	}

	return (
		<RemoveDialog
			name={segmentName ?? ""}
			noun="Segment"
			onConfirm={handleSubmit}
			onHide={() => setOpen(false)}
			show={open}
		/>
	);
}
