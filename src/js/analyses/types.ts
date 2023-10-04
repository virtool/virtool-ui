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
    created_at: string;
    /** The unique identifier for the analysis */
    id: string;
    /** Index associated with the analysis */
    index: IndexNested;
    /** Information about the job associated with the analysis */
    job?: JobMinimal;
    ready: boolean;
    /** Reference associated with the analysis */
    reference: ReferenceNested;
    sample: AnalysisSample;
    /** Subtractions associated with the analysis */
    subtractions: Array<SubtractionNested>;
    updated_at: Date;
    /** The user who created the analysis */
    user: UserNested;
    /** Workflow associated with the analysis */
    workflow: string;
    canModify: boolean;
};

/** An analysis file */
export type AnalysisFile = {
    analysis: string;
    description?: string | null;
    format: string;
    id: number;
    name: string;
    name_on_disk: string;
    /** The size of the file in bytes */
    size?: number;
    uploaded_at?: Date;
};

/** A complete Analysis */
export type Analysis = AnalysisMinimal & {
    files: Array<AnalysisFile>;
    results?: { [key: string]: any };
};

/** Analysis search results from the API */
export type AnalysisSearchResult = SearchResult & {
    documents: Array<AnalysisMinimal>;
};
