import { Account } from "@account/types";
import { Permission } from "@groups/types";
import { AdministratorRoleName } from "./types";

/**
 * The permissions level of each administrator role
 */
enum AdministratorPermissionsLevel {
    full,
    settings,
    spaces,
    users,
    base,
}

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
export enum AdministratorPermissions {
    cancel_job = AdministratorRoleName.BASE,
    create_ref = AdministratorRoleName.BASE,
    modify_hmm = AdministratorRoleName.BASE,
    remove_job = AdministratorRoleName.BASE,
    upload_file = AdministratorRoleName.FULL,
    create_sample = AdministratorRoleName.FULL,
    modify_subtraction = AdministratorRoleName.FULL,
    remove_file = AdministratorRoleName.FULL,
}

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
