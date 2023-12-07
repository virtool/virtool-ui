import { Task } from "../tasks/types";
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

export type ReferenceSearchResult = SearchResult & {
    documents: ReferenceMinimal;
    official_installed: boolean;
};

export class Reference {
    clonedFrom: ReferenceClonedFrom | null;
    contributors: ReferenceContributor[];
    createdAt: Date;
    dataType: ReferenceDataType;
    description: string;
    groups: ReferenceGroup[];
    id: string;
    importedFrom: ReferenceImportedFrom | null;
    installed: boolean;
    internalControl: string | null;
    latestBuild: ReferenceLatestBuild;
    name: string;
    organism: string;
    otuCount: number;
    release: ReferenceRelease | null;
    remotesFrom: ReferenceRemotesFrom | null;
    restrictSourceTypes: boolean;
    sourceTypes: string[];
    targets: ReferenceTarget[];
    task: Task | null;
    unbuiltChangeCount: number;
    updating: boolean;
    user: UserNested;
    users: ReferenceUser[];

    constructor(data) {
        this.clonedFrom = data.cloned_from;
        this.contributors = data.contributors;
        this.createdAt = new Date(data.created_at);
        this.dataType = data.data_type;
        this.description = data.description;
        this.groups = data.groups;
        this.id = data.id;
        this.importedFrom = data.imported_from;
        this.installed = data.installed;
        this.internalControl = data.internal_control;
        this.latestBuild = data.latest_build;
        this.name = data.name;
        this.organism = data.organism;
        this.otuCount = data.otu_count;
        this.release = data.release;
        this.remotesFrom = data.remotes_from;
        this.restrictSourceTypes = data.restrict_source_types;
        this.sourceTypes = data.source_types;
        this.targets = data.targets;
        this.task = data.task;
        this.unbuiltChangeCount = data.unbuilt_change_count;
        this.updating = data.updating;
        this.user = data.user;
        this.users = data.users;
    }
}
