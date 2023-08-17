/**
 * Full model of an administrator role
 */
export type AdministratorRole = {
    id: string;
    name: AdministratorRoles;
    description: string;
};

/**
 * All administrator roles
 */
export enum AdministratorRoles {
    FULL = "full",
    SETTINGS = "settings",
    SPACES = "spaces",
    USERS = "users",
    BASE = "base",
}

export type PermissionQueryResult = {
    hasPermission: boolean | null;
    isLoading: boolean;
};
