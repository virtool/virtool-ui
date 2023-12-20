import { Task } from "../types";
import { UserNested } from "../users/types";
import { SearchResult } from "../utils/types";

export type ReferenceClonedFrom = {
    id: string;
    name: string;
};

export type ReferenceContributor = {
    administrator: boolean;
    count: number;
    handle: string;
    id: string;
};

export type ReferenceDataType = "barcode" | "genome";

export type ReferenceGroup = {
    build: boolean;
    createdAt: Date;
    id: string;
    modify: boolean;
    modifyOtu: boolean;
    remove: boolean;
};

export type ReferenceImportedFrom = {
    id: string;
    name: string;
};

export type ReferenceLatestBuild = {
    createdAt: Date;
    id: string;
    user: UserNested;
    version: number;
};

export type ReferenceRemotesFrom = {
    errors: string[];
    slug: string;
};

export type ReferenceRelease = {
    body: string;
    content_type: string;
    download_url: string;
    etag: string;
    filename: string;
    html_url: string;
    id: number;
    name: string;
    newer: boolean;
    published_at: Date;
    retrieved_at: Date;
    size: number;
};

export type ReferenceTarget = {
    description: string;
    length: number;
    name: string;
    required: boolean;
};

export type ReferenceUser = UserNested & {
    createdAt: Date;
    build: boolean;
    modify: boolean;
    modifyOtu: boolean;
    remove: boolean;
};

/** Basic reference data for nested representation */
export type ReferenceNested = {
    /** The unique identifier */
    id: string;
    /** The build style dictating workflow compatibility */
    data_type: ReferenceDataType;
    /** The user defined name */
    name: string;
};

export type ReferenceInstalled = {
    body: string;
    created_at: Date;
    filename: string;
    html_url: string;
    id: number;
    name: string;
    newer: boolean;
    published_at: Date;
    ready: boolean;
    size: number;
    user: UserNested;
};

export type ReferenceBuild = {
    createdAt: Date;
    id: string;
    user: UserNested;
    version: number;
    has_json: boolean;
};

export type ReferenceMinimal = ReferenceNested & {
    cloned_from: ReferenceClonedFrom | null;
    created_at: string;
    imported_from: File | null;
    installed: ReferenceInstalled;
    internal_control: string | null;
    latest_build: ReferenceBuild;
    organism: string;
    otu_count: number;
    release: ReferenceRelease;
    remotes_from: ReferenceRemotesFrom | null;
    task: Task;
    unbuilt_change_count: number;
    updating: boolean | null;
    user: UserNested;
};

export type Reference = ReferenceMinimal & {
    contributers: Array<ReferenceContributor>;
    description: string;
    groups: Array<ReferenceGroup>;
    restrict_source_types: boolean;
    source_types: Array<string>;
    targets: ReferenceTarget;
    users: Array<ReferenceUser>;
};

export type ReferenceSearchResult = SearchResult & {
    documents: Array<ReferenceMinimal>;
    official_installed: boolean;
};
