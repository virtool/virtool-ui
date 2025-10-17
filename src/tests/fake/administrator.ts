import { Settings } from "@/types/api";
import { AdministratorRoleName } from "@administration/types";
import { faker } from "@faker-js/faker";
import { User } from "@users/types";
import { assign } from "lodash";
import nock from "nock";

export const administratorRoles = [
    {
        description: "Manage who is an administrator and what they can do.",
        id: "full",
        name: "Full",
    },
    {
        description: "Manage instance settings and administrative messages.",
        id: "settings",
        name: "Settings",
    },
    {
        description:
            "Create user accounts. Control activation of user accounts.",
        id: "users",
        name: "Users",
    },
    {
        description:
            "Provides ability to:\n     - Create new spaces even if the `Free Spaces` setting is not enabled.\n     - Manage HMMs and common references.\n     - View all running jobs.\n     - Cancel any job.\n    ",
        id: "base",
        name: "Base",
    },
];

type CreateFakeSettings = {
    enable_api?: boolean;
    sample_group?: string;
    sample_group_read?: boolean;
    sample_group_write?: boolean;
    sample_all_read?: boolean;
    sample_all_write?: boolean;
};

/**
 * Create fake settings
 *
 * @param overrides - optional properties for creating fake settings with specific values
 */
export function createFakeSettings(overrides?: CreateFakeSettings): Settings {
    const defaultSettings = {
        default_source_types: [faker.word.noun({ strategy: "any-length" })],
        enable_api: faker.datatype.boolean(),
        enable_sentry: faker.datatype.boolean(),
        hmm_slug: "virtool/virtool-hmm",
        minimum_password_length: 8,
        sample_all_read: faker.datatype.boolean(),
        sample_all_write: faker.datatype.boolean(),
        sample_group: null,
        sample_group_read: faker.datatype.boolean(),
        sample_group_write: faker.datatype.boolean(),
        sample_unique_names: faker.datatype.boolean(),
    };

    return assign(defaultSettings, overrides);
}

export function mockGetAdministratorRoles() {
    return nock("http://localhost")
        .get("/api/admin/roles")
        .reply(200, administratorRoles);
}

type mockSetAdministratorRoleAPIProps = {
    user: User;
    new_role: AdministratorRoleName;
};
export function mockSetAdministratorRoleAPI({
    user,
    new_role,
}: mockSetAdministratorRoleAPIProps) {
    return nock("http://localhost")
        .put(`/api/admin/users/${user.id}/role`, { role: new_role })
        .reply(200);
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
