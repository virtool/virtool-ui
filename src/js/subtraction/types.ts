import { JobMinimal } from "../jobs/types";
import { SampleNested } from "../samples/types";
import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

<<<<<<< HEAD
/* The measurements of individual nucleotides (percentage) */
=======
/* The composition of a Nucleotide */
>>>>>>> ui-64-add-subtraction-models
export type NucleotideComposition = {
    a: number;
    c: number;
    g: number;
    t: number;
<<<<<<< HEAD
    /* Unknown nucleotide */
=======
>>>>>>> ui-64-add-subtraction-models
    n: number;
};

/* A Subtraction file */
export type SubtractionFile = {
    download_url: string;
    id: number;
    name: string;
<<<<<<< HEAD
    /* The size of file (bytes) */
    size: number;
    /* The subtraction ID */
=======
    size: number;
>>>>>>> ui-64-add-subtraction-models
    subtraction: string;
    type: string;
};

/* A Subtraction with essential information  */
export type SubtractionNested = {
<<<<<<< HEAD
    id: string;
=======
    /* The unique identifier */
    id: string;
    /* The subtraction's name */
>>>>>>> ui-64-add-subtraction-models
    name: string;
};

/* Subtraction file being uploaded */
export type SubtractionUpload = {
    id: number | string;
    name: string;
};

<<<<<<< HEAD
/* Minimal Subtraction used for websocket messages and resource listings */
export type SubtractionMinimal = SubtractionNested & {
    count?: number;
    created_at: Date;
    /* The uploaded file */
    file: SubtractionUpload;
    /* Information about the job associated with the subtraction */
    job?: JobMinimal;
    nickname: string;
    ready: boolean;
    /* The user who created the subtraction */
    user?: UserNested;
};

/* A complete Subtraction */
=======
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
>>>>>>> ui-64-add-subtraction-models
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
