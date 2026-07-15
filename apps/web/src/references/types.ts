import type { UserNested } from "@users/types";
import type { SearchResult, Task } from "../types/api";

export type ReferenceClonedFrom = {
	id: string;
	name: string;
};

export type ReferenceContributor = UserNested & {
	count: number;
};

export type ReferenceRights = {
	build: boolean;
	modify: boolean;
	modify_otu: boolean;
	remove: boolean;
};

export type ReferenceGroup = ReferenceRights & {
	id: string | number;
	created_at: string;
	legacy_id: string | null;
	name: string;
};

export type ReferenceUser = UserNested &
	ReferenceRights & {
		created_at: string;
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

/** Basic reference data for nested representation */
export type ReferenceNested = {
	/** The unique identifier */
	id: string;

	/** The build style dictating workflow compatibility */
	data_type: string;

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
	created_at: string;
	id: string;
	user: UserNested;
	version: number;
	has_json: boolean;
};

export type ReferenceMinimal = ReferenceNested & {
	archived: boolean;
	cloned_from: ReferenceClonedFrom | null;
	created_at: string;
	imported_from: File | null;
	installed: ReferenceInstalled | null;
	internal_control: string | null;
	latest_build: ReferenceBuild | null;
	organism: string;
	otu_count: number;
	release: ReferenceRelease | null;
	remotes_from: ReferenceRemotesFrom | null;
	task: Task;
	unbuilt_change_count: number;
	updating: boolean | null;
	user: UserNested;
};

export type Reference = ReferenceMinimal & {
	contributors: Array<ReferenceContributor>;
	description: string;
	groups: Array<ReferenceGroup>;
	restrict_source_types: boolean;
	source_types: Array<string>;
	users: Array<ReferenceUser>;
};

export type ReferenceSearchResult = SearchResult & {
	items: Array<ReferenceMinimal>;
};
