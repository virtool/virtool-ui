import { useFetchAccount } from "../account/querys";
import { AdministratorRoles } from "./types";
import { hasSufficientAdminRole } from "./utils";

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
