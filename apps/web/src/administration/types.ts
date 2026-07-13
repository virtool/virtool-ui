/**
 * Types related to administrative management of Virtool.
 */

/**
 * Full model of an administrator role
 */
export type AdministratorRole = {
	description: string;
	id: AdministratorRoleName;
	name: string;
};

/**
 * All administrator roles
 */
export type AdministratorRoleName =
	| "full"
	| "settings"
	| "spaces"
	| "users"
	| "base";

/**
 * Instance-wide settings
 */
export type Settings = {
	default_source_types: string[];
	enable_api: boolean;
	enable_sentry: boolean;
	minimum_password_length: number;
	sample_all_read: boolean;
	sample_all_write: boolean;
	sample_group: string;
	sample_group_read: boolean;
	sample_group_write: boolean;
};
