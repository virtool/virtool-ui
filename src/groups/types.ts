import type { UserNested } from "@users/types";
import type { SearchResult } from "@/types/api";

export type GroupMinimal = {
	id: number;
	legacy_id: string | null;
	name: string;
};

export type Group = GroupMinimal & {
	permissions: Permissions;
	users: UserNested[];
};

export type Permissions = {
	cancel_job: boolean;
	create_ref: boolean;
	create_sample: boolean;
	modify_hmm: boolean;
	modify_subtraction: boolean;
	remove_file: boolean;
	remove_job: boolean;
	upload_file: boolean;
};

export type Permission =
	| "cancel_job"
	| "create_ref"
	| "create_sample"
	| "modify_hmm"
	| "modify_subtraction"
	| "remove_file"
	| "remove_job"
	| "upload_file";

export type PermissionsUpdate = {
	cancel_job?: boolean;
	create_ref?: boolean;
	create_sample?: boolean;
	modify_hmm?: boolean;
	modify_subtraction?: boolean;
	remove_file?: boolean;
	remove_job?: boolean;
	upload_file?: boolean;
};

export type GroupUpdate = {
	id: string | number;
	name?: string;
	permissions?: PermissionsUpdate;
};

/** Group search results from the API */
export type GroupSearchResults = SearchResult & {
	/** Gives information about each group */
	items: Array<GroupMinimal>;
};
