/**
 * Types related to administrative management of Virtool.
 */

/**
 * Full model of an administrator role
 */
export type AdministratorRole = {
    description: string;
    id: string;
    name: AdministratorRoleName;
};

/**
 * All administrator roles
 */
export enum AdministratorRoleName {
    FULL = "full",
    SETTINGS = "settings",
    SPACES = "spaces",
    USERS = "users",
    BASE = "base",
}

export type Settings = {
    default_source_types: string[];
    enable_api: boolean;
    enable_sentry: boolean;
    hmm_slug: string;
    minimum_password_length: number;
    sample_all_read: boolean;
    sample_all_write: boolean;
    sample_group: string;
    sample_group_read: boolean;
    sample_group_write: boolean;
    sample_unique_names: boolean;
};
