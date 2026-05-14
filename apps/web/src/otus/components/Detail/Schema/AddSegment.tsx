import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useUpdateOTU } from "@otus/queries";
import type { Molecule, OtuSegment } from "@otus/types";
import SegmentForm from "./SegmentForm";

type FormValues = {
	segmentName: string;
	molecule: Molecule;
	required: boolean;
};

type AddSegmentProps = {
	abbreviation: string;
	name: string;
	open?: boolean;
	otuId: string;
	/** The segments associated with the otu */
	schema: OtuSegment[];
	setOpen?: (open: boolean) => void;
};

/**
 * Displays a dialog for adding a segment
 */
export default function AddSegment({
	otuId,
	name,
	abbreviation,
	open = false,
	schema,
	setOpen = () => {},
}: AddSegmentProps) {
	const mutation = useUpdateOTU(otuId);

	function handleSubmit({ segmentName, molecule, required }: FormValues) {
		mutation.mutate(
			{
				otuId,
				name,
				abbreviation,
				schema: [...schema, { name: segmentName, molecule, required }],
			},
			{
				onSuccess: () => {
					setOpen(false);
				},
			},
		);
	}

	return (
		<Dialog open={open} onOpenChange={() => setOpen(false)}>
			<DialogContent>
				<DialogTitle>Add Segment</DialogTitle>
				<SegmentForm onSubmit={handleSubmit} schema={schema} />
			</DialogContent>
		</Dialog>
	);
}
