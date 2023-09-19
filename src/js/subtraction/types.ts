import { JobMinimal } from "../jobs/types";
import { SampleNested } from "../samples/types";
import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

/* The composition of a Nucleotide */
export type NucleotideComposition = {
    a: number;
    c: number;
    g: number;
    t: number;
    n: number;
};

/* A Subtraction file */
export type SubtractionFile = {
    download_url: string;
    id: number;
    name: string;
    size: number;
    subtraction: string;
    type: string;
};

/* A Subtraction with essential information  */
export type SubtractionNested = {
    /* The unique identifier */
    id: string;
    /* The subtraction's name */
    name: string;
};

/* Subtraction file being uploaded */
export type SubtractionUpload = {
    id: number | string;
    name: string;
};

/* Minimal Subtraction model used for websocket messages and resource listings */
export type SubtractionMinimal = SubtractionNested & {
    count?: number;
    created_at: Date;
    /* Name of associated subtraction file */
    file: SubtractionUpload;
    /* Information related to job of subtraction upload */
    job?: JobMinimal;
    nickname: string;
    ready: boolean;
    /* The associated user */
    user?: UserNested;
};

/* Complete Subtraction model */
export type Subtraction = SubtractionMinimal & {
    /* Data files available to workflows */
    files: Array<SubtractionFile>;
    gc?: NucleotideComposition;
    /* Samples linked to subtraction */
    linked_samples: Array<SampleNested>;
};

/* Subtraction search results from the API */
export type SubtractionSearchResult = SearchResult & {
    ready_count: number;
    documents: Array<SubtractionMinimal>;
};
