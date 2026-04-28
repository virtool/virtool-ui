import RemoveDialog from "@base/RemoveDialog";
import { useOtuDetailSearch } from "@otus/components/Detail/OtuDetailSearchContext";
import { useRemoveSequence } from "@otus/queries";
import type { OtuSequence } from "@otus/types";

type RemoveSequenceProps = {
	isolateName: string;
	isolateId: string;
	otuId: string;
	sequences: OtuSequence[];
};

/**
 * Displays a dialog for removing a sequence
 */
export default function RemoveSequence({
	isolateName,
	isolateId,
	otuId,
	sequences,
}: RemoveSequenceProps) {
	const { search, setSearch } = useOtuDetailSearch();
	const removeSequenceId = search.removeSequenceId;

	const mutation = useRemoveSequence(otuId);

	const sequence = sequences.find((seq) => seq.id === removeSequenceId);

	function handleConfirm() {
		mutation.mutate(
			{ otuId, isolateId, sequenceId: removeSequenceId },
			{
				onSuccess: () => {
					setSearch({ removeSequenceId: undefined });
				},
			},
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
			name={`${removeSequenceId}`}
			noun="Sequence"
			onConfirm={handleConfirm}
			onHide={() => setSearch({ removeSequenceId: undefined })}
			show={Boolean(removeSequenceId)}
			message={removeMessage}
		/>
	);
}
