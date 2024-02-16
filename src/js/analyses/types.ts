import { IndexNested } from "../indexes/types";
import { JobMinimal } from "../jobs/types";
import { ReferenceNested } from "../references/types";
import { SubtractionNested } from "../subtraction/types";
import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

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
export type Analysis = AnalysisMinimal & {
    /** Files generated during the analysis that are available for download */
    files: Array<AnalysisFile>;
    /** The results of the analysis that will be presented to the user */
    results?: { [key: string]: any };
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
