import { IndexNested } from "@indexes/types";
import { JobMinimal } from "@jobs/types";
import { ReferenceNested } from "@references/types";
import { SubtractionNested } from "@subtraction/types";
import { UserNested } from "@users/types";
import { SearchResult } from "@utils/types";

/** The sample associated with the analysis */
export type AnalysisSample = {
    id: string;
};

/** Minimal Analysis used for websocket messages and resource listings */
export type AnalysisMinimal = {
    /** When the analysis was created */
    created_at: string;
    /** The unique identifier for the analysis */
    id: string;
    /** The reference index used in the analysis */
    index: IndexNested;
    /** The job that ran the analysis workflow */
    job?: JobMinimal;
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
    workflow: string;
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
    results?: { [key: string]: any };
    workflow: Workflows.aodp;
};

export type Analysis =
    | FormattedPathoscopeAnalysis
    | FormattedNuvsAnalysis
    | IimiAnalysis
    | GenericAnalysis;

export type FormattedPathoscopeAnalysis = AnalysisMinimal & {
    files: Array<AnalysisFile>;
    results: FormattedPathoscopeResults;
    workflow: Workflows.pathoscope_bowtie;
};

/** All results for a pathoscope analysis*/
export type FormattedPathoscopeResults = {
    hits: FormattedPathoscopeHit[];
    /** The total number of reads mapped to the reference during the analysis*/
    read_count: number;
    /** The number of reads that were mapped to subtractions*/
    subtracted_count: number;
};

/** Mapping data for a single pathoscope hit*/
export type FormattedPathoscopeHit = {
    abbreviation: string;
    /** The proportion of the sequence that has mapped read coverage*/
    coverage: number;
    /** The average depth of coverage for the sequence */
    depth: number;
    /** the position mapped depths of the reference sequence*/
    filled: PositionMappedReadDepths;
    id: string;
    isolates: FormattedPathoscopeIsolate[];
    length: number;
    /** The largest depth on any single reference nucleotide */
    maxDepth: number;
    maxGenomeLength: number;
    name: string;
    /** The proportion of reads from the entire sample that match this hit */
    pi: number;
    reads: number;
    version: number;
};

/** Mapping data for a single pathoscope reference isolate */
export type FormattedPathoscopeIsolate = {
    default: boolean;
    id: string;
    source_name: string;
    source_type: string;
    sequences: FormattedPathoscopeSequence[];
};

/** The mapping data for a single pathoscope reference sequence*/
export type FormattedPathoscopeSequence = {
    id: string;
    /** The genebank accession number of the reference sequence */
    accession: string;
    /** alignment coordinates  */
    align: [number, number][];
    best: number;
    /** The proportion of the sequence that has mapped read coverage*/
    coverage: number;
    /** A description of the sequence */
    definition: string;
    length: number;
    /** The proportion of reads from the entire sample that match this hit */
    pi: number;
    /** The number of reads that match this hit */
    reads: number;
};

/** Complete NuVs analysis details */
export type FormattedNuvsAnalysis = AnalysisMinimal & {
    files: Array<AnalysisFile>;
    maxSequenceLength: number;
    results: FormattedNuvsResults;
    workflow: Workflows.nuvs;
};

/** All results for a NuVs analysis */
export type FormattedNuvsResults = {
    hits: FormattedNuvsHit[];
};

/** Mapping data for a single NuVs hit */
export type FormattedNuvsHit = {
    annotatedOrfCount: number;
    blast: Blast;
    e: number;
    families: string[];
    id: number;
    index: number;
    name: string[];
    orfs: NuVsORFs[];
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

export type NuVsORFs = {
    frame: number;
    hits: { [key: string]: string | object };
    index: number;
    pos: number[];
    pro: string;
    strand: number;
};

/** Analysis search results from the API */
export type AnalysisSearchResult = SearchResult & {
    documents: Array<AnalysisMinimal>;
};

export enum Workflows {
    pathoscope_bowtie = "pathoscope_bowtie",
    nuvs = "nuvs",
    iimi = "iimi",
    aodp = "aodp",
}

/** Read depths of a sequence mapped by position to an array */
export type PositionMappedReadDepths = number[];

/** regions of a sequence where there is a greater chance of erroneous read mapping*/
export type UntrustworthyRange = [number, number];

/** RLE encoded coverage data output from Iimi workflow analysis*/
export type IimiCoverage = {
    /** The length in base-pairs of the corresponding coverage depth*/
    lengths: number[];
    /** The coverage depths */
    values: number[];
};

/** The data for a segment of an isolates genome */
export type IimiSequence = {
    id: string;
    coverage: IimiCoverage;
    /** The total base pairs of the sequence*/
    length: number;
    /** Whether the ML workflow determined this sequence was present in the sample*/
    result: false;
    /** regions of the sequence with high similarity between references */
    untrustworthy_ranges: UntrustworthyRange[];
};

/** The results of the Immi analysis for an individual isolate*/
export type IimiIsolate = {
    id: string;
    sequences: IimiSequence[];
    source_name: string;
    source_type: string;
};

/** An OTU which has mapped reads as a result of the iimi workflow*/
export type IimiHit = {
    id: string;
    abbreviation: string;
    isolates: IimiIsolate[];
    name: string;
    result: boolean;
};

export type IimiAnalysis = AnalysisMinimal & {
    files: Array<AnalysisFile>;
    results: {
        hits: IimiHit[];
    };
    workflow: Workflows.iimi;
};
