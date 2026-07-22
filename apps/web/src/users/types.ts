import type { AdministratorRoleName } from "@administration/types";
import type { GroupMinimal, Permissions } from "@groups/types";

/** A user with the essential information */
export type UserNested = {
	/** The unique identifier */
	id: number;

	/** The user's handle or username */
	handle: string;
};

/** A Virtool user */
export type User = UserNested & {
	/** Their administrator role defining what resources they can modify */
	administrator_role: AdministratorRoleName | null;

	/** Indicates if user is active */
	active: boolean;

	/** Whether the user will be forced to reset their password on next login */
	force_reset: boolean;

	/** A list of their groups */
	groups: Array<GroupMinimal>;

	/** The date of their last password change */
	last_password_change: string;

	/** Their permissions */
	permissions: Permissions;

	/** Their primary group */
	primary_group: GroupMinimal | null;
};
