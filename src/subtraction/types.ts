import { SearchResult } from "@/types/api";
import { JobMinimal } from "@jobs/types";
import { SampleNested } from "@samples/types";
import { UserNested } from "@users/types";

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
    /** The URL the file can be downloaded at. */
    download_url: string;

    /** The unique ID for the file. */
    id: number;

    /** The display name. */
    name: string;

    /** The size in (bytes) */
    size: number;

    /** The subtraction ID */
    subtraction: string;

    type: string;
};

/** A Subtraction with essential information  */
export type SubtractionNested = {
    /** The unique identifier for the subtraction */
    id: string;

    /** The name of the subtraction */
    name: string;
};

/** Subtraction file being uploaded */
export type SubtractionUpload = {
    id: number | string;
    name: string;
};

/** Minimal Subtraction used for websocket messages and resource listings */
export type SubtractionMinimal = SubtractionNested & {
    /** The number of sequences in the subtraction */
    count?: number;

    /** When the subtraction was created */
    created_at: string;

    /** The uploaded file */
    file: SubtractionUpload;

    /** The job associated with the subtraction */
    job?: JobMinimal;

    /** The subtraction nickname */
    nickname: string;

    /**  Whether the subtraction is complete and ready to view */
    ready: boolean;

    /** The user who created the subtraction */
    user?: UserNested;
};

/** A complete Subtraction */
export type Subtraction = SubtractionMinimal & {
    /** Data uploads available to for download */
    files: Array<SubtractionFile>;

    /** The ATGC ratios in the subtraction genome */
    gc?: NucleotideComposition;

    /** Samples linked to subtraction */
    linked_samples: Array<SampleNested>;
};

/** A subtraction as an option for analysis */
export type SubtractionOption = SubtractionNested & {
    isDefault?: boolean;
    ready: boolean;
};

/** Subtraction search results from the API */
export type SubtractionSearchResult = SearchResult & {
    ready_count: number;
    documents: Array<SubtractionMinimal>;
};
