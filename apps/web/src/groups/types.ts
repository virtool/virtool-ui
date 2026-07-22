import type { UserNested } from "@users/types";
import type { Permission, Permissions } from "@virtool/contracts";
import type { SearchResult } from "@/types/api";

export type { Permission, Permissions };

export type GroupMinimal = {
	id: number;
	legacy_id: string | null;
	name: string;
};

export type Group = GroupMinimal & {
	permissions: Permissions;
	users: UserNested[];
};

/** Partial permission flags accepted when updating a group or key. */
export type PermissionsUpdate = Partial<Permissions>;

/** Group search results from the API */
export type GroupSearchResults = SearchResult & {
	/** Gives information about each group */
	items: Array<GroupMinimal>;
};
