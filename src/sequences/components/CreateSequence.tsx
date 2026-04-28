import { Dialog, DialogContent, DialogTitle } from "@base/Dialog";
import { useOtuDetailSearch } from "@otus/components/Detail/OtuDetailSearchContext";
import { useCreateSequence } from "@otus/queries";
import type { OtuSegment, OtuSequence } from "@otus/types";
import { compact } from "es-toolkit";
import SequenceForm from "./SequenceForm";

type CreateSequenceProps = {
	isolateId: string;
	otuId: string;
	refId: string;
	schema: OtuSegment[];
	sequences: OtuSequence[];
};

/**
 * Displays dialog to add a genome sequence
 */
export default function CreateSequence({
	isolateId,
	otuId,
	refId,
	schema,
	sequences,
}: CreateSequenceProps) {
	const { search, setSearch } = useOtuDetailSearch();

	const mutation = useCreateSequence(otuId);

	const segments = schema.filter(
		(segment) =>
			!compact(sequences.map((seq) => seq.segment)).includes(segment.name),
	);

	function onSubmit({ accession, definition, host, sequence, segment }) {
		mutation.mutate(
			{
				accession,
				definition,
				host,
				isolateId,
				segment,
				sequence: sequence.toUpperCase(),
			},
			{
				onSuccess: () => {
					setSearch({ openCreateSequence: false });
				},
			},
		);
	}

	return (
		<Dialog
			open={Boolean(search.openCreateSequence)}
			onOpenChange={() => setSearch({ openCreateSequence: false })}
		>
			<DialogContent className="top-1/2">
				<DialogTitle>Create Sequence</DialogTitle>
				<SequenceForm
					hasSchema={schema.length > 0}
					noun="create"
					onSubmit={onSubmit}
					otuId={otuId}
					refId={refId}
					segments={segments}
				/>
			</DialogContent>
		</Dialog>
	);
}
