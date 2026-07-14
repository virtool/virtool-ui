import { cn } from "@app/cn";

/** Column-width classes shared by the sequence list header and each row's cells. */
export const SEQUENCE_ACCESSION_COLUMN = "w-24 shrink-0 mr-5 min-w-0";
export const SEQUENCE_TITLE_COLUMN = "flex-1 min-w-0";

export function SequenceAccessionValue({ accession }: { accession: string }) {
	return (
		<div className={cn(SEQUENCE_ACCESSION_COLUMN, "truncate")}>{accession}</div>
	);
}

export function SequenceTitleValue({ value }: { value: string }) {
	return <div className={cn(SEQUENCE_TITLE_COLUMN, "truncate")}>{value}</div>;
}
