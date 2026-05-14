import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useOtuDetailSearch } from "@otus/components/Detail/OtuDetailSearchContext";
import { useGetActiveIsolateId } from "@otus/hooks";
import { useCurrentOtuContext, useEditSequence } from "@otus/queries";
import { useActiveSequence, useGetUnreferencedSegments } from "../hooks";
import SequenceForm from "./SequenceForm";

/**
 * Displays dialog to edit a genome sequence
 */
export default function SequenceEdit() {
	const { search, setSearch } = useOtuDetailSearch();
	const { otu, reference } = useCurrentOtuContext();
	const isolateId = useGetActiveIsolateId(otu);

	const hasSchema = Boolean(otu.schema.length);

	const editSequenceId = search.editSequenceId;

	const mutation = useEditSequence(otu.id);

	const segments = useGetUnreferencedSegments();
	const activeSequence = useActiveSequence();

	function onSubmit({ accession, definition, host, sequence, segment }) {
		mutation.mutate(
			{
				isolateId,
				sequenceId: activeSequence.id,
				accession,
				definition,
				host,
				segment,
				sequence,
			},
			{
				onSuccess: () => {
					setSearch({ editSequenceId: undefined });
				},
			},
		);
	}

	return (
		<Dialog
			open={Boolean(editSequenceId)}
			onOpenChange={() => setSearch({ editSequenceId: undefined })}
		>
			<DialogContent>
				<DialogTitle>Edit Sequence</DialogTitle>
				<SequenceForm
					activeSequence={activeSequence}
					hasSchema={hasSchema}
					noun="edit"
					onSubmit={onSubmit}
					otuId={otu.id}
					refId={reference.id}
					segments={segments}
				/>
			</DialogContent>
		</Dialog>
	);
}
