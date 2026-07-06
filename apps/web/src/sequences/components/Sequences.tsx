import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import BoxGroupSection from "@base/BoxGroupSection";
import NoneFoundSection from "@base/NoneFoundSection";
import { useCurrentOtuContext } from "@otus/queries";
import type { OtuIsolate, OtuSequence } from "@otus/types";
import sortSequencesBySegment from "@otus/utils";
import { useReferenceIsArchived } from "@references/hooks";
import { useState } from "react";
import CreateSequence from "./CreateSequence";
import RemoveSequence from "./RemoveSequence";
import Sequence from "./Sequence";
import SequenceEdit from "./SequenceEdit";
import {
	SEQUENCE_ACCESSION_COLUMN,
	SEQUENCE_TITLE_COLUMN,
} from "./SequenceValues";

/**
 * Column headings for the sequence list, aligned to each row's cells.
 */
function SequenceListHeader() {
	return (
		<BoxGroupSection className="flex items-center bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
			<span className={SEQUENCE_ACCESSION_COLUMN}>Accession</span>
			<span className={SEQUENCE_TITLE_COLUMN}>Definition / Segment</span>
		</BoxGroupSection>
	);
}

type IsolateSequencesProps = {
	/** The Isolate that is currently selected */
	activeIsolate: OtuIsolate;
	otuId: string;
	/** Whether the create sequence dialog is open */
	openCreate: boolean;
	/** Called to change whether the create sequence dialog is open */
	setOpenCreate: (open: boolean) => void;
};

/**
 * Display and manage a list sequences for a specific isolate
 */
export default function Sequences({
	activeIsolate,
	otuId,
	openCreate,
	setOpenCreate,
}: IsolateSequencesProps) {
	const { otu, reference } = useCurrentOtuContext();
	const archived = useReferenceIsArchived(reference.id);
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
	isolateName = (isolateName[0] ?? "").toUpperCase() + isolateName.slice(1);

	const hasSequences = sequenceComponents.length > 0;

	if (!hasSequences) {
		sequenceComponents = [
			<NoneFoundSection noun="sequences" key="noSequences" />,
		];
	}

	return (
		<>
			<div className="flex items-center font-medium mb-2">
				<strong className="text-base pr-1">Sequences</strong>
				<Badge>{sequences.length}</Badge>
			</div>

			<BoxGroup>
				{hasSequences && <SequenceListHeader />}
				{sequenceComponents}
			</BoxGroup>

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
