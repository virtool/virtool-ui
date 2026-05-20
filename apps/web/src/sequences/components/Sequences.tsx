import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import NoneFoundSection from "@base/NoneFoundSection";
import { useCurrentOtuContext } from "@otus/queries";
import type { OtuIsolate, OtuSequence } from "@otus/types";
import sortSequencesBySegment from "@otus/utils";
import { useReferenceIsArchived } from "@references/hooks";
import { useState } from "react";
import CreateSequence from "./CreateSequence";
import CreateSequenceLink from "./CreateSequenceLink";
import RemoveSequence from "./RemoveSequence";
import Sequence from "./Sequence";
import SequenceEdit from "./SequenceEdit";

type IsolateSequencesProps = {
	/** The Isolate that is currently selected */
	activeIsolate: OtuIsolate;
	otuId: string;
};

/**
 * Display and manage a list sequences for a specific isolate
 */
export default function Sequences({
	activeIsolate,
	otuId,
}: IsolateSequencesProps) {
	const { otu, reference } = useCurrentOtuContext();
	const archived = useReferenceIsArchived(reference.id);
	const [openCreate, setOpenCreate] = useState(false);
	const [sequenceToEdit, setSequenceToEdit] = useState<
		OtuSequence | undefined
	>();
	const [sequenceToRemove, setSequenceToRemove] = useState<
		OtuSequence | undefined
	>();

	const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

	let sequenceComponents = sequences.map((sequence) => (
		<Sequence
			key={sequence.id}
			{...sequence}
			onEdit={() => setSequenceToEdit(sequence)}
			onRemove={() => setSequenceToRemove(sequence)}
		/>
	));

	let isolateName = `${activeIsolate.source_type} ${activeIsolate.source_name}`;
	isolateName = isolateName[0].toUpperCase() + isolateName.slice(1);

	if (!sequenceComponents.length) {
		sequenceComponents = [
			<NoneFoundSection noun="sequences" key="noSequences" />,
		];
	}

	return (
		<>
			<label className="flex items-center font-medium">
				<strong className="text-base pr-1">Sequences</strong>
				<Badge>{sequences.length}</Badge>
				<CreateSequenceLink
					onCreate={() => setOpenCreate(true)}
					refId={reference.id}
				/>
			</label>

			<BoxGroup>{sequenceComponents}</BoxGroup>

			<CreateSequence
				isolateId={activeIsolate.id}
				open={openCreate && !archived}
				otuId={otuId}
				refId={reference.id}
				schema={otu.schema}
				sequences={sequences}
				setOpen={setOpenCreate}
			/>

			<SequenceEdit
				activeSequence={sequenceToEdit}
				isolateId={activeIsolate.id}
				open={Boolean(sequenceToEdit) && !archived}
				otuId={otuId}
				refId={reference.id}
				schema={otu.schema}
				sequences={sequences}
				setOpen={(open) => {
					if (!open) {
						setSequenceToEdit(undefined);
					}
				}}
			/>
			<RemoveSequence
				isolateId={activeIsolate.id}
				isolateName={isolateName}
				otuId={otuId}
				open={Boolean(sequenceToRemove) && !archived}
				sequence={sequenceToRemove}
				setOpen={(open) => {
					if (!open) {
						setSequenceToRemove(undefined);
					}
				}}
			/>
		</>
	);
}
