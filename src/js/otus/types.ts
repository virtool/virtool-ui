import { ReferenceNested } from "../references/types";
import { SearchResult } from "../utils/types";

/** Basic data for list representations */
export type OTUMinimal = {
    abbreviation: string;
    id: string;
    name: string;
    reference: ReferenceNested;
    verified: boolean;
    version: number;
};

/** OTU search results from API*/
export type OTUSearchResult = SearchResult & {
    documents: OTUMinimal[];
    modified_count: number;
};
