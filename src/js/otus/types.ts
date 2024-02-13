import { ReferenceNested } from "../references/types";
import { SearchResult } from "../utils/types";

export enum Molecule {
    ds_dna = "dsDNA",
    ds_rna = "dsRNA",
    ss_dna = "ssDNA",
    ss_rna = "ssRNA",
    ss_rna_neg = "ssRNA-",
    ss_rna_pos = "ssRNA+",
}

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
