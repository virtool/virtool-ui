import Badge from "@base/Badge";
import BoxGroup from "@base/BoxGroup";
import NoneFoundSection from "@base/NoneFoundSection";
import { useCurrentOtuContext } from "@otus/queries";
import type { OtuIsolate } from "@otus/types";
import sortSequencesBySegment from "@otus/utils";
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

	const sequences = sortSequencesBySegment(activeIsolate.sequences, otu.schema);

	let sequenceComponents = sequences.map((sequence) => (
		<Sequence key={sequence.id} {...sequence} />
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
				<CreateSequenceLink refId={reference.id} />
			</label>

			<BoxGroup>{sequenceComponents}</BoxGroup>

			<CreateSequence
				isolateId={activeIsolate.id}
				otuId={otuId}
				refId={reference.id}
				schema={otu.schema}
				sequences={sequences}
			/>

			<SequenceEdit />
			<RemoveSequence
				isolateId={activeIsolate.id}
				isolateName={isolateName}
				otuId={otuId}
				sequences={sequences}
			/>
		</>
	);
}
