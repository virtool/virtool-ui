import { Account } from "@account/types";
import { Permission } from "../groups/types";
import { AdministratorRoles } from "./types";

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

export function hasSufficientAdminRole(requiredRole: AdministratorRoles, userRole: AdministratorRoles): boolean {
    return AdministratorPermissionsLevel[userRole] <= AdministratorPermissionsLevel[requiredRole];
}

/**
 * Permissions granted to each administrator role
 */
export enum AdministratorPermissions {
    cancel_job = AdministratorRoles.BASE,
    create_ref = AdministratorRoles.BASE,
    modify_hmm = AdministratorRoles.BASE,
    remove_job = AdministratorRoles.BASE,
    upload_file = AdministratorRoles.FULL,
    create_sample = AdministratorRoles.FULL,
    modify_subtraction = AdministratorRoles.FULL,
    remove_file = AdministratorRoles.FULL,
}

/**
 * Check if a user has a sufficient admin role or legacy permissions to perform an action
 *
 * @param account - The Account object of the user
 * @param permission - The permissions to check
 * @returns  Whether the user is allowed to perform the action
 */
export function checkAdminRoleOrPermissionsFromAccount(account: Account, permission: Permission): boolean {
    return (
        hasSufficientAdminRole(AdministratorPermissions[permission as string], account.administrator_role) ||
        account.permissions[permission]
    );
}
