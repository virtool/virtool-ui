import { useFetchAccount } from "../account/querys";
import { AdministratorRoles, permissionQueryResult } from "./types";
import { hasSufficientAdminRole } from "./utils";

/**
 * Checks if the user has a sufficient admin role
 *
 * Fetches the users admin role from the backend and checks if it meets or exceeds
 * the role required to perform the action.
 *
 * @param {AdministratorRoles} requiredRole The required role to check against.
 * @returns {permissionQueryResult} Whether the user has the required role.
 */
export function useCheckAdminRole(requiredRole: AdministratorRoles): permissionQueryResult {
    const { data: account, isLoading } = useFetchAccount();
    return {
        hasPermission: account ? hasSufficientAdminRole(requiredRole, account.administrator_role) : null,
        isLoading,
    };
}
