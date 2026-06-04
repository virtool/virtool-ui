import type { AdministratorRole } from "@administration/types";
import { faker } from "@faker-js/faker";
import nock from "nock";
import type { Settings } from "@/types/api";

export const administratorRoles: AdministratorRole[] = [
	{
		description: "Manage who is an administrator and what they can do.",
		id: "full",
		name: "Full",
	},
	{
		description: "Manage instance settings.",
		id: "settings",
		name: "Settings",
	},
	{
		description: "Manage users in any space. Delete any space.",
		id: "spaces",
		name: "Spaces",
	},
	{
		description: "Create user accounts. Control activation of user accounts.",
		id: "users",
		name: "Users",
	},
	{
		description:
			"Provides ability to:\n    - Create new spaces even if the `Free Spaces` setting is not enabled.\n    - Manage HMMs and common references.\n    - View all running jobs.\n    - Cancel any job.",
		id: "base",
		name: "Base",
	},
];

/**
 * Create fake settings
 *
 * @param overrides - optional properties for creating fake settings with specific values
 */
export function createFakeSettings(overrides?: Partial<Settings>): Settings {
	const defaultSettings = {
		default_source_types: [faker.word.noun({ strategy: "any-length" })],
		enable_api: faker.datatype.boolean(),
		enable_sentry: faker.datatype.boolean(),
		hmm_slug: "virtool/virtool-hmm",
		minimum_password_length: 8,
		sample_all_read: faker.datatype.boolean(),
		sample_all_write: faker.datatype.boolean(),
		sample_group: "none",
		sample_group_read: faker.datatype.boolean(),
		sample_group_write: faker.datatype.boolean(),
		sample_unique_names: faker.datatype.boolean(),
	};

	return { ...defaultSettings, ...overrides };
}

/**
 * Sets up a mocked API route for fetching the settings
 *
 * @param settings - The documents for settings
 * @returns The nock scope for the mocked API call
 */
export function mockApiGetSettings(settings: Settings) {
	return nock("http://localhost").get("/api/settings").reply(200, settings);
}

/**
 * Sets up a mocked API route for updating the settings
 *
 * @param settings - The updated documents for settings
 * @returns The nock scope for the mocked API call
 */
export function mockApiUpdateSettings(settings: Settings) {
	return nock("http://localhost").patch("/api/settings").reply(200, settings);
}
