import { IndexNested } from "@indexes/types";
import { ReferenceNested } from "../references/types";
import { UserNested } from "../users/types";


import { SearchResult } from "@/types";

export enum Molecule {
    ds_dna = "dsDNA",
    ds_rna = "dsRNA",
    ss_dna = "ssDNA",
    ss_rna = "ssRNA",
    ss_rna_neg = "ssRNA-",
    ss_rna_pos = "ssRNA+",
}

export enum HistoryMethod {
    add_isolate = "add_isolate",
    create = "create",
    create_sequence = "create_sequence",
    clone = "clone",
    edit = "edit",
    edit_sequence = "edit_sequence",
    edit_isolate = "edit_isolate",
    remove = "remove",
    remote = "remote",
    remove_isolate = "remove_isolate",
    remove_sequence = "remove_sequence",
    import_otu = "import",
    set_as_default = "set_as_default",
    update = "update",
}

/** Contains information on history change */
export type HistoryNested = {
    /** When the change was made */
    created_at: string;
    /** A human readable description for the change */
    description: string;
    /** The unique ID for the change */
    id: string;
    /** The name of the method that made the change (eg. edit_sequence) */
    method_name: HistoryMethod;
    /** Identifying information for the user that made the change */
    user: UserNested;
};

export type OTUHistory = HistoryNested & {
    index: IndexNested;
    otu: OTUNested;
    reference: ReferenceNested;
};

export type OTURemote = {
    id: string;
};

export type OTUSequence = {
    accession: string;
    definition: string;
    host: string;
    id: string;
    remote?: OTURemote;
    segment?: string;
    sequence: string;
    target?: string;
};

export type OTUIsolate = {
    default: boolean;
    id: string;
    sequences: OTUSequence[];
    source_name: string;
    source_type: string;
};

export type OTUSegment = {
    molecule?: Molecule;
    name: string;
    required: boolean;
};

export type OTUNested = {
    id: string;
    name: string;
    version: number;
};

/** Basic data for list representations */
export type OTUMinimal = OTUNested & {
    abbreviation: string;
    reference: ReferenceNested;
    verified: boolean;
};

/** A complete OTU */
export type OTU = OTUMinimal & {
    isolates: Array<OTUIsolate>;
    issues?: { [key: string]: any } | boolean;
    last_indexed_version?: number;
    most_recent_change: HistoryNested;
    schema: Array<OTUSegment>;
    remote?: OTURemote;
};

/** OTU search results from API*/
export type OTUSearchResult = SearchResult & {
    documents: OTUMinimal[];
    modified_count: number;
};
