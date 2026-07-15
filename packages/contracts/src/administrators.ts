import type { Permission } from "./permissions";

/** All administrator roles, ordered from most to least privileged. */
export type AdministratorRoleName =
	| "full"
	| "settings"
	| "spaces"
	| "users"
	| "base";

/**
 * The permissions level of each administrator role
 */
const AdministratorPermissionsLevel: Record<AdministratorRoleName, number> = {
	full: 0,
	settings: 1,
	spaces: 2,
	users: 3,
	base: 4,
};

/**
 * Check if a user has a sufficient admin role
 *
 * @param requiredRole - The lowest admin role the user must have to pass the check
 * @param userRole - The administrator role of the user
 */
export function hasSufficientAdminRole(
	requiredRole: AdministratorRoleName,
	userRole: AdministratorRoleName | null,
): boolean {
	if (userRole === null) {
		return false;
	}

	return (
		AdministratorPermissionsLevel[userRole] <=
		AdministratorPermissionsLevel[requiredRole]
	);
}

/**
 * Permissions granted to each administrator role
 */
export const AdministratorPermissions: Record<
	Permission,
	AdministratorRoleName
> = {
	cancel_job: "base",
	create_ref: "base",
	modify_hmm: "base",
	remove_job: "base",
	upload_file: "full",
	create_sample: "full",
	modify_subtraction: "full",
	remove_file: "full",
};
