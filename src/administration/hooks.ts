import { Permission } from "@groups/types";
import { useFetchAccount } from "../account/queries";
import { AdministratorRoles } from "./types";
import {
    checkAdminRoleOrPermissionsFromAccount,
    hasSufficientAdminRole,
} from "./utils";

export type PermissionQueryResult = {
    hasPermission: boolean | null;
    isPending: boolean;
};

/**
 * Check the logged-in user has sufficient admin role
 *
 * @param requiredRole - The required role to check against.
 * @returns Whether the user has the required role.
 */
export function useCheckAdminRole(
    requiredRole: AdministratorRoles,
): PermissionQueryResult {
    const { data: account, isPending } = useFetchAccount();
    return {
        hasPermission: account
            ? hasSufficientAdminRole(requiredRole, account.administrator_role)
            : null,
        isPending,
    };
}

export function useCheckAdminRoleOrPermission(permission: Permission) {
    const { data: account, isPending } = useFetchAccount();
    return {
        hasPermission: account
            ? checkAdminRoleOrPermissionsFromAccount(account, permission)
            : null,
        isPending,
    };
}
