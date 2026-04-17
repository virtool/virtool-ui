import type { Account } from "@account/types";
import type { Permission } from "@groups/types";
import type { AdministratorRoleName } from "./types";

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
	userRole: AdministratorRoleName,
): boolean {
	return (
		AdministratorPermissionsLevel[userRole] <=
		AdministratorPermissionsLevel[requiredRole]
	);
}

/**
 * Permissions granted to each administrator role
 */
export const AdministratorPermissions: Record<string, AdministratorRoleName> = {
	cancel_job: "base",
	create_ref: "base",
	modify_hmm: "base",
	remove_job: "base",
	upload_file: "full",
	create_sample: "full",
	modify_subtraction: "full",
	remove_file: "full",
};

/**
 * Check if a user has a sufficient admin role or legacy permissions to perform an action
 *
 * @param account - The Account object of the user
 * @param permission - The permissions to check
 * @returns  Whether the user is allowed to perform the action
 */
export function checkAdminRoleOrPermissionsFromAccount(
	account: Account,
	permission: Permission,
): boolean {
	return (
		hasSufficientAdminRole(
			AdministratorPermissions[permission as string],
			account.administrator_role,
		) || account.permissions[permission]
	);
}
