import DeleteDialog from "@base/DeleteDialog";
import { useRemoveSequence } from "@otus/queries";
import type { OtuSequence } from "@otus/types";

type RemoveSequenceProps = {
	isolateId: string;
	isolateName: string;
	otuId: string;
	open?: boolean;
	sequence?: OtuSequence;
	setOpen?: (open: boolean) => void;
};

/**
 * Displays a dialog for removing a sequence
 */
export default function RemoveSequence({
	isolateId,
	isolateName,
	otuId,
	open = false,
	sequence,
	setOpen = () => {},
}: RemoveSequenceProps) {
	const mutation = useRemoveSequence(otuId);

	function handleConfirm() {
		if (!sequence) {
			return;
		}

		return mutation.mutateAsync({ otuId, isolateId, sequenceId: sequence.id });
	}

	const deleteMessage = (
		<span>
			Are you sure you want to delete the sequence
			<strong> {sequence?.accession}</strong> from
			<strong> {isolateName}</strong>?
		</span>
	);

	return (
		<DeleteDialog
			name={sequence?.id ?? ""}
			noun="Sequence"
			onConfirm={handleConfirm}
			onOpenChange={setOpen}
			open={open}
			message={deleteMessage}
		/>
	);
}
