export type {
	NucleotideComposition,
	Subtraction,
	SubtractionFile,
	SubtractionMinimal,
	SubtractionNested,
	SubtractionSearchResult,
	SubtractionUpload,
} from "@virtool/contracts";

/** A subtraction as an option for analysis */
export type SubtractionOption = {
	/** The unique identifier for the subtraction */
	id: number;

	/** The name of the subtraction */
	name: string;

	isDefault?: boolean;
	ready: boolean;
};
