import RemoveDialog from "@base/RemoveDialog";
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
		mutation.mutate(
			{ otuId, isolateId, sequenceId: sequence.id },
			{ onSuccess: () => setOpen(false) },
		);
	}

	const removeMessage = (
		<span>
			Are you sure you want to remove the sequence
			<strong> {sequence?.accession}</strong> from
			<strong> {isolateName}</strong>?
		</span>
	);

	return (
		<RemoveDialog
			name={sequence?.id ?? ""}
			noun="Sequence"
			onConfirm={handleConfirm}
			onHide={() => setOpen(false)}
			show={open}
			message={removeMessage}
		/>
	);
}
