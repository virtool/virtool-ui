import { SearchResult } from "@/types/api";
import { IndexNested } from "@indexes/types";
import { ReferenceNested } from "@references/types";
import { UserNested } from "@users/types";

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

    /** A human-readable description for the change */
    description: string;

    /** The unique ID for the change */
    id: string;

    /** The name of the method that made the change (eg. edit_sequence) */
    method_name: HistoryMethod;

    /** Identifying information for the user that made the change */
    user: UserNested;
};

export type OtuHistory = HistoryNested & {
    index: IndexNested;
    otu: OtuNested;
    reference: ReferenceNested;
};

export type OtuRemote = {
    id: string;
};

export type OtuSequence = {
    accession: string;
    definition: string;
    host: string;
    id: string;
    remote?: OtuRemote;
    segment?: string;
    sequence: string;
    target?: string;
};

export type OtuIsolate = {
    default: boolean;
    id: string;
    sequences: OtuSequence[];
    source_name: string;
    source_type: string;
};

export type OtuSegment = {
    molecule?: Molecule;
    name: string;
    required: boolean;
};

export type OtuNested = {
    id: string;
    name: string;
    version: number;
};

/** Basic data for list representations */
export type OtuMinimal = OtuNested & {
    abbreviation: string;
    reference: ReferenceNested;
    verified: boolean;
};

/** A complete OTU */
export type Otu = OtuMinimal & {
    isolates: Array<OtuIsolate>;
    issues?: { [key: string]: any } | boolean;
    last_indexed_version?: number;
    most_recent_change: HistoryNested;
    schema: Array<OtuSegment>;
    remote?: OtuRemote;
};

/** OTU search results from API*/
export type OtuSearchResult = SearchResult & {
    documents: OtuMinimal[];
    modified_count: number;
};
