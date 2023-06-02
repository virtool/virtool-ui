export type AdministratorRole = {
    id: string;
    name: AdministratorRoles;
    description: string;
};

export enum AdministratorRoles {
    FULL = "full",
    SETTINGS = "settings",
    SPACES = "spaces",
    USERS = "users",
    BASE = "base"
}
