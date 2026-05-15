import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useUpdateOTU } from "@otus/queries";
import type { Molecule, OtuSegment } from "@otus/types";
import SegmentForm from "./SegmentForm";

type FormValues = {
	segmentName: string;
	molecule: Molecule;
	required: boolean;
};

type EditSegmentProps = {
	abbreviation: string;
	editSegmentName?: string;
	name: string;
	otuId: string;
	/** The segments associated with the otu */
	schema: OtuSegment[];
	unsetEditSegmentName?: () => void;
};

/**
 * Displays a dialog to edit a segment
 */
export default function EditSegment({
	abbreviation,
	editSegmentName,
	otuId,
	name,
	schema,
	unsetEditSegmentName = () => {},
}: EditSegmentProps) {
	const mutation = useUpdateOTU(otuId);

	const segment = schema.find((s) => s.name === editSegmentName);

	function handleSubmit({ segmentName, molecule, required }: FormValues) {
		const newArray = schema.map((item) => {
			return item.name === editSegmentName
				? { name: segmentName, molecule, required }
				: item;
		});

		mutation.mutate(
			{ otuId, name, abbreviation, schema: newArray },
			{
				onSuccess: () => {
					unsetEditSegmentName();
				},
			},
		);
	}

	return (
		<Dialog
			open={Boolean(editSegmentName)}
			onOpenChange={() => unsetEditSegmentName()}
		>
			<DialogContent>
				<DialogTitle>Edit Segment</DialogTitle>
				<SegmentForm
					segmentName={editSegmentName}
					molecule={segment?.molecule}
					required={segment?.required}
					onSubmit={handleSubmit}
					schema={schema}
				/>
			</DialogContent>
		</Dialog>
	);
}
