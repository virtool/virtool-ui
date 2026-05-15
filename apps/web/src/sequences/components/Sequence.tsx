import BoxGroupSection from "@base/BoxGroupSection";
import { useExpanded } from "../hooks";
import SequenceButtons from "./SequenceButtons";
import SequenceTable from "./SequenceTable";
import { SequenceAccessionValue, SequenceTitleValue } from "./SequenceValues";

type GenomeSequenceProps = {
	accession: string;
	definition: string;
	host: string;
	id: string;
	onEdit: () => void;
	onRemove: () => void;
	segment?: string;
	sequence: string;
};

/**
 * A condensed genome sequence item for use in a list of sequences
 */
export default function Sequence({
	accession,
	definition,
	host,
	id,
	onEdit,
	onRemove,
	segment,
	sequence,
}: GenomeSequenceProps) {
	const { expanded, expand, collapse } = useExpanded();

	return (
		<BoxGroupSection onClick={expand}>
			<div className="flex items-start">
				<SequenceAccessionValue accession={accession} />
				<SequenceTitleValue
					label={segment ? "SEGMENT" : "DEFINITION"}
					value={segment || definition}
				/>
				{expanded && (
					<SequenceButtons
						id={id}
						onCollapse={collapse}
						onEdit={onEdit}
						onRemove={onRemove}
					/>
				)}
			</div>
			{expanded && (
				<SequenceTable
					definition={definition}
					host={host}
					segment={segment}
					sequence={sequence}
				/>
			)}
		</BoxGroupSection>
	);
}
