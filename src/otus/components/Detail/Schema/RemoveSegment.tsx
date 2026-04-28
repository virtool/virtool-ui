import RemoveDialog from "@base/RemoveDialog";
import { useUpdateOTU } from "@otus/queries";
import type { OtuSegment } from "@otus/types";

type RemoveSegmentProps = {
	abbreviation: string;
	name: string;
	otuId: string;
	removeSegmentName?: string;
	/** List of segments associated with the OTU */
	schema: OtuSegment[];
	unsetRemoveSegmentName?: () => void;
};

/**
 * Displays a dialog for removing a segment
 */
export default function RemoveSegment({
	abbreviation,
	name,
	otuId,
	removeSegmentName,
	schema,
	unsetRemoveSegmentName = () => {},
}: RemoveSegmentProps) {
	const mutation = useUpdateOTU(otuId);

	function handleSubmit() {
		mutation.mutate(
			{
				otuId,
				name,
				abbreviation,
				schema: schema.filter((s) => s.name !== removeSegmentName),
			},
			{
				onSuccess: () => {
					unsetRemoveSegmentName();
				},
			},
		);
	}

	function onHide() {
		unsetRemoveSegmentName();
	}

	return (
		<RemoveDialog
			name={removeSegmentName}
			noun="Segment"
			onConfirm={handleSubmit}
			onHide={onHide}
			show={Boolean(removeSegmentName)}
		/>
	);
}
