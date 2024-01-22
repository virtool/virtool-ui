import { SearchResult } from "../utils/types";

/** Minimal HMM used for websocket messages and resource listings */
export type HMMMinimal = {
    /** The unique identifier */
    id: string;
    cluster: number;
    count: number;
    families: { [key: string]: number };
    /** Names associated with the HMM */
    names: string[];
};

export type HMMSequenceEntry = {
    accession: string;
    gi: string;
    name: string;
    organism: string;
};

export type HMM = HMMMinimal & {
    entries: Array<HMMSequenceEntry>;
    genera: { [key: string]: number };
    length: number;
    mean_entropy: number;
    total_entropy: number;
};

/** HMM search results from the API */
export type HMMSearchResults = SearchResult & {
    /** Gives information about each HMM */
    documents: HMMMinimal[];
    /** The status of the HMMs */
    status: { [key: string]: any };
};
