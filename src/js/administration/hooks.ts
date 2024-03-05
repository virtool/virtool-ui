import { useFetchAccount } from "../account/queries";
import { Permission } from "../groups/types";
import { AdministratorRoles } from "./types";
import { checkAdminRoleOrPermissionsFromAccount, hasSufficientAdminRole } from "./utils";

export type PermissionQueryResult = {
    hasPermission: boolean | null;
    isLoading: boolean;
};

/**
 * Check the logged-in user has sufficient admin role
 *
 * @param requiredRole - The required role to check against.
 * @returns Whether the user has the required role.
 */
export function useCheckAdminRole(requiredRole: AdministratorRoles): PermissionQueryResult {
    const { data: account, isLoading } = useFetchAccount();
    return {
        hasPermission: account ? hasSufficientAdminRole(requiredRole, account.administrator_role) : null,
        isLoading,
    };
}

export function useCheckAdminRoleOrPermission(permission: Permission) {
    const { data: account, isLoading } = useFetchAccount();
    return {
        hasPermission: account ? checkAdminRoleOrPermissionsFromAccount(account, permission) : null,
        isLoading,
    };
}
