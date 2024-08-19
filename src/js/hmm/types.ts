import { UserNested } from "@users/types";
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

export type HMMInstalled = {
    body: string;
    created_at: string;
    filename: string;
    html_url: string;
    id: number;
    name: string;
    newer: boolean;
    published: string;
    ready: boolean;
    size: number;
    user: UserNested;
};

/** HMM search results from the API */
export type HMMSearchResults = SearchResult & {
    /** Gives information about each HMM */
    documents: HMMMinimal[];
    /** The status of the HMMs */
    status: { [key: string]: any };
};
