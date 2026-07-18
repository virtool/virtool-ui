import type { IndexNested } from "@indexes/types";
import type { ServerJobNested } from "@jobs/types";
import type { ReferenceNested } from "@references/types";
import type { SubtractionNested } from "@subtraction/types";
import type { UserNested } from "@users/types";
import type { SearchResult } from "@/types/api";

/** The sample associated with the analysis */
export type AnalysisSample = {
	id: number;
};

/** Minimal Analysis used for resource listings */
export type AnalysisMinimal = {
	/** When the analysis was created */
	created_at: string;

	/** The unique identifier for the analysis */
	id: number;

	/** The reference index used in the analysis */
	index: IndexNested;

	/** The job that ran the analysis workflow */
	job?: ServerJobNested;

	/** Whether the analysis is complete and ready to view */
	ready: boolean;

	/** The reference used for the analysis */
	reference: ReferenceNested;

	/** The parent sample for the analysis */
	sample: AnalysisSample;

	/** Subtractions used in the analysis */
	subtractions: Array<SubtractionNested>;

	/** When the analysis was last updated */
	updated_at: string;

	/** The user who created the analysis */
	user: UserNested;

	/** Workflow used to generate the analysis */
	workflow: AnalysisWorkflow;
};

/** An analysis file */
export type AnalysisFile = {
	/** The analysis ID */
	analysis: string;

	/** The file description */
	description?: string | null;

	/** The format of the file */
	format: string;

	/** The unique identifier */
	id: number;

	/** The file name */
	name: string;

	/** The disk name of the file */
	name_on_disk: string;

	/** The size of the file in bytes */
	size?: number;

	/** When the analysis file was uploaded */
	uploaded_at?: Date;
};

/** A complete Analysis */
export type GenericAnalysis = AnalysisMinimal & {
	/** Files generated during the analysis that are available for download */
	files: Array<AnalysisFile>;

	/** The results of the analysis that will be presented to the user */
	results?: { [key: string]: unknown };

	workflow: AnalysisWorkflow;
};

export type Analysis =
	| FormattedPathoscopeAnalysis
	| FormattedNuvsAnalysis
	| GenericAnalysis;

export type FormattedPathoscopeAnalysis = AnalysisMinimal & {
	files: AnalysisFile[];
	results: FormattedPathoscopeResults;
	workflow: "pathoscope";
};

/** All results for a pathoscope analysis*/
export type FormattedPathoscopeResults = {
	/** The hit OTUs and metrics */
	hits: FormattedPathoscopeHit[];

	/** The total number of reads mapped to the reference during the analysis*/
	readCount: number;

	/** The number of reads that were mapped to subtractions*/
	subtractedCount: number;
};

/** Mapping data for a single pathoscope hit*/
export type FormattedPathoscopeHit = {
	/** The abbreviation of the hit OTU */
	abbreviation: string;

	/** The proportion of the sequence that has mapped read coverage*/
	coverage: number;

	/** The average depth of coverage for the sequence */
	depth: number;

	/** the position mapped depths of the reference sequence*/
	filled: PositionMappedReadDepths;

	/** The ID of the hit OTU */
	id: string;

	/** The isolates of the hit OTU */
	isolates: FormattedPathoscopeIsolate[];

	length: number;

	/** The largest depth on any single reference nucleotide */
	maxDepth: number;

	/** The longest sequence length sum of all isolates */
	maxGenomeLength: number;

	/** The name of the hit OTU */
	name: string;

	/** The proportion of reads from the entire sample that match this hit */
	pi: number;

	/** Estimated number of reads mapped to the OTU */
	reads: number;

	/** The version of the hit OTU */
	version: number;
};

/** Mapping data for a single pathoscope reference isolate */
export type FormattedPathoscopeIsolate = {
	coverage: number;
	default: boolean;
	depth: number;
	filled: number[];
	id: string;
	name: string;
	pi: number;
	sequences: FormattedPathoscopeSequence[];
	source_name: string;
	source_type: string;
};

/** The mapping data for a single pathoscope reference sequence*/
export type FormattedPathoscopeSequence = {
	/** The ID of the hit sequence */
	id: string;

	/** The Genbank accession number of the hit sequence */
	accession: string;

	/** alignment coordinates  */
	align: [number, number][];

	best: number;

	/** The proportion of the sequence that has mapped read coverage*/
	coverage: number;

	/** A description of the sequence */
	definition: string;

	/** the per-position mapped read depths, derived from the alignment */
	filled: number[];

	length: number;

	/** The proportion of reads from the entire sample that match this hit */
	pi: number;

	/** The number of reads that match this hit */
	reads: number;
};

/** Complete Nuvs analysis details */
export type FormattedNuvsAnalysis = AnalysisMinimal & {
	files: Array<AnalysisFile>;
	maxSequenceLength: number;
	results: FormattedNuvsResults;
	workflow: "nuvs";
};

/** All results for a Nuvs analysis */
export type FormattedNuvsResults = {
	hits: FormattedNuvsHit[];
};

/** Mapping data for a single Nuvs hit */
export type FormattedNuvsHit = {
	annotatedOrfCount: number;
	blast: Blast | null;
	e: number;
	families: string[];
	id: number;
	index: number;
	name: string[];
	orfs: NuvsOrf[];
	sequence: string;
};

export type Blast = {
	created_at: string;
	error?: string;
	id: number;
	interval: number;
	last_checked_at: string;
	ready: boolean;
	result: BlastResults;
	rid: string;
	updated_at: string;
};

export type BlastResults = {
	hits: BlastHit[];
	masking: BlastMask[];
	params: { [key: string]: string | number };
	program: string;
	stat: { [key: string]: number };
	target: { [key: string]: string };
	version: string;
	rid: string;
	updated_at: string;
};

export type BlastHit = {
	accession: string;
	align_len: number;
	bit_score: number;
	evalue: number;
	gaps: number;
	identity: number;
	len: number;
	name: string;
	score: number;
	taxid: number;
	title: string;
};

export type BlastMask = {
	from: number;
	to: number;
};

export type NuvsOrfHit = {
	cluster: number;
	best_bias: number;
	best_e: number;
	best_score: number;
	families: { [key: string]: number };
	full_bias: number;
	full_e: number;
	full_score: number;
	hit: string;
	names: string[];
};

export type NuvsOrf = {
	frame: number;
	hits: NuvsOrfHit[];
	index: number;
	pos: number[];
	pro: string;
	strand: number;
};

/** Analysis search results from the API */
export type AnalysisSearchResult = SearchResult & {
	items: AnalysisMinimal[];
};

export type AnalysisWorkflow = "pathoscope" | "nuvs";

/** Read depths of a sequence mapped by position to an array */
export type PositionMappedReadDepths = number[];
