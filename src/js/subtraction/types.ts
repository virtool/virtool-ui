import { JobMinimal } from "../jobs/types";
import { SampleNested } from "../samples/types";
import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

/** The measurements of individual nucleotides (percentage) */
export type NucleotideComposition = {
    a: number;
    c: number;
    g: number;
    t: number;
    /** Unknown nucleotide */
    n: number;
};

/** A Subtraction file */
export type SubtractionFile = {
    download_url: string;
    id: number;
    name: string;
    /** The size of file (bytes) */
    size: number;
    /** The subtraction ID */
    subtraction: string;
    type: string;
};

/** A Subtraction with essential information  */
export type SubtractionNested = {
    id: string;
    name: string;
};

/** Subtraction file being uploaded */
export type SubtractionUpload = {
    id: number | string;
    name: string;
};

/** Minimal Subtraction used for websocket messages and resource listings */
export type SubtractionMinimal = SubtractionNested & {
    count?: number;
    /** The iso formatted date of creation */
    created_at: string;
    /** The uploaded file */
    file: SubtractionUpload;
    /** Information about the job associated with the subtraction */
    job?: JobMinimal;
    nickname: string;
    ready: boolean;
    /** The user who created the subtraction */
    user?: UserNested;
};

/** A complete Subtraction */
export type Subtraction = SubtractionMinimal & {
    /** Data files available to workflows */
    files: Array<SubtractionFile>;
    gc?: NucleotideComposition;
    /** Samples linked to subtraction */
    linked_samples: Array<SampleNested>;
};

/** Subtraction search results from the API */
export type SubtractionSearchResult = SearchResult & {
    ready_count: number;
    documents: Array<SubtractionMinimal>;
};
