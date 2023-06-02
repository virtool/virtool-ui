import { getAccountAdministratorRole } from "./selectors";
import { AdministratorRoles } from "./types";

enum AdministratorPermissionsLevel {
    full,
    settings,
    spaces,
    users,
    base
}

export const hasSufficientAdminRole = (requiredRole: AdministratorRoles, userRole: AdministratorRoles): boolean => {
    return AdministratorPermissionsLevel[userRole] <= AdministratorPermissionsLevel[requiredRole];
};

export enum AdministratorPermissions {
    cancel_job = AdministratorRoles.BASE,
    create_ref = AdministratorRoles.BASE,
    modify_hmm = AdministratorRoles.BASE,
    remove_job = AdministratorRoles.BASE,
    upload_file = AdministratorRoles.FULL,
    create_sample = AdministratorRoles.FULL,
    modify_subtraction = AdministratorRoles.FULL,
    remove_file = AdministratorRoles.FULL
}

export const checkAdminRoleOrPermission = (state, permission: string) =>
    hasSufficientAdminRole(AdministratorPermissions[permission], getAccountAdministratorRole(state)) ||
    state.account.permissions[permission];
