import { JobMinimal } from "@jobs/types";
import { HistoryNested, OTUNested } from "@otus/types";
import { ReferenceNested } from "@references/types";
import { UserNested } from "@users/types";


import { SearchResult } from "@/types";

/** Basic data for nested representations */
export type IndexNested = {
    /** The unique identifier */
    id: string;
    /** The build iteration */
    version: number;
};

/** Minimal index data for list views */
export type IndexMinimal = IndexNested & {
    /** Total changes included in building the new index */
    change_count: number;
    /** The iso formatted date of creation */
    created_at: string;
    /** Whether there are downloadable files */
    has_files: boolean;
    /** The job responsible for creation */
    job?: JobMinimal;
    /** A count of individual OTUs changed */
    modified_otu_count: number;
    /** The reference the index is based on */
    reference: ReferenceNested;
    /** Who initiated index creation */
    user: UserNested;
    /** Whether it is ready to view and be used */
    ready: boolean;
};

/**  Index editor information*/
export type IndexContributor = UserNested & {
    /** Total index changes made by the user */
    count: number;
};

/** Index relevant minimal OTU data*/
export type IndexOTU = {
    /** The quantity of changes made to this otu since last index build */
    change_count: number;
    /** The unique identifier */
    id: string;
    /** The display name */
    name: string;
};

export type IndexFile = {
    /** The complete file location on API */
    download_url: string;
    /** The unique identifier */
    id: number;
    /** The unique identifier of the associated index */
    index: string;
    /** The display name */
    name: string;
    /** The file size in bytes */
    size?: number;
    /** The associated workflow */
    type: string;
};

/** Reference index for use in workflows */
export type Index = IndexMinimal & {
    /** Users who contributed to the index*/
    contributors: IndexContributor[];
    /** Downloadable index files*/
    files: IndexFile[];
    /** The last index the OTU was included in */
    manifest: object;
    /** OTUs incorporated in the index*/
    otus: IndexOTU[];
};

export type UnbuiltChanges = HistoryNested & {
    index: IndexNested;
    otu: OTUNested;
    reference: ReferenceNested;
};

/** Unbuilt changes search results */
export type UnbuiltChangesSearchResults = SearchResult & {
    documents: UnbuiltChanges[];
};

/** Index search results */
export type IndexSearchResult = SearchResult & {
    /** Indexes relevant to the query*/
    documents: Index[];
    /** The number of individual OTUs changes since the last index build */
    modified_otu_count: number;
    /** The number of total OTUs in the reference */
    total_otu_count: number;
    /** The number of total changes in the reference since the last index build */
    change_count: number;
};
