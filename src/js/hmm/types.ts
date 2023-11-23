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

/** HMM search results from the API */
export type HMMSearchResults = SearchResult & {
    /** Gives information about each HMM */
    documents: HMMMinimal[];
    /** The status of the HMMs */
    status: { [key: string]: any };
};
