import { cn } from "@app/cn";

/** Column-width classes shared by the sequence list header and each row's cells. */
export const SEQUENCE_CHEVRON_COLUMN = "w-5 shrink-0 mr-2";
export const SEQUENCE_ACCESSION_COLUMN = "w-24 shrink-0 mr-5 min-w-0";
export const SEQUENCE_SEGMENT_COLUMN = "w-40 shrink-0 mr-5 min-w-0";
export const SEQUENCE_DEFINITION_COLUMN = "flex-1 min-w-0";

export function SequenceAccessionValue({ accession }: { accession: string }) {
	return (
		<div className={cn(SEQUENCE_ACCESSION_COLUMN, "truncate")}>{accession}</div>
	);
}

export function SequenceSegmentValue({ segment }: { segment?: string | null }) {
	return (
		<div className={cn(SEQUENCE_SEGMENT_COLUMN, "truncate")}>
			{segment || <em className="text-gray-400">None</em>}
		</div>
	);
}

export function SequenceDefinitionValue({
	definition,
}: {
	definition: string;
}) {
	return (
		<div className={cn(SEQUENCE_DEFINITION_COLUMN, "truncate")}>
			{definition}
		</div>
	);
}
