import { cn } from "@app/utils";
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
	segment?: string | null;
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
		<BoxGroupSection
			onClick={expanded ? undefined : expand}
			className={cn("flex flex-wrap items-start", {
				"cursor-pointer hover:bg-gray-50": !expanded,
			})}
		>
			<SequenceAccessionValue accession={accession} />
			<SequenceTitleValue value={segment || definition} />
			{expanded && (
				<SequenceButtons
					id={id}
					onCollapse={collapse}
					onEdit={onEdit}
					onRemove={onRemove}
				/>
			)}
			{expanded && (
				<div className="basis-full">
					<SequenceTable
						definition={definition}
						host={host}
						segment={segment}
						sequence={sequence}
					/>
				</div>
			)}
		</BoxGroupSection>
	);
}
