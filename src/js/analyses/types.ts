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
    /** The iso formatted date of creation */
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
    /** The iso formatted date of when the analysis was last updated */
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
    /** The iso formatted date of when the analysis file was uploaded */
    uploaded_at?: string;
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
