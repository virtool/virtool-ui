import type { Permissions } from "@virtool/contracts";

export type {
	Group,
	GroupMinimal,
	GroupSearchResults,
	Permission,
	Permissions,
} from "@virtool/contracts";

/** Partial permission flags accepted when updating a group or key. */
export type PermissionsUpdate = Partial<Permissions>;
