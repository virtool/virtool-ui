import {
    Account,
    AccountSettings,
    APIKeyMinimal,
    QuickAnalyzeWorkflow,
} from "@account/types";
import { AdministratorRoles } from "@administration/types";
import { faker } from "@faker-js/faker";
import { GroupMinimal, Permissions } from "@groups/types";
import { merge } from "lodash";
import nock from "nock";
import { createFakeGroupMinimal } from "./groups";
import { createFakePermissions } from "./permissions";
import { createFakeUser } from "./user";

const defaultSettings = {
    quick_analyze_workflow: QuickAnalyzeWorkflow.pathoscope_bowtie,
    show_ids: true,
    show_versions: true,
    skip_quick_analyze_dialog: true,
};

type CreateFakeAccountArgs = {
    administrator_role?: AdministratorRoles;
    email?: string;
    groups?: GroupMinimal[];
    handle?: string;
    permissions?: Permissions;
    primary_group?: GroupMinimal;
    settings?: AccountSettings;
};

export function createFakeAccount(props?: CreateFakeAccountArgs): Account {
    const { settings, email, ...userProps } = props || {};

    return {
        email: email === undefined ? faker.internet.email() : email,
        settings: { ...defaultSettings, ...settings },
        ...{ settings, email },
        ...createFakeUser(userProps),
    };
}

type CreateFakeApiKeysArgs = {
    name?: string;
    groups?: Array<GroupMinimal>;
    permissions?: Permissions;
};

/**
 * Create a fake API key
 *
 * @param props - optional properties for creating a fake API key with specific values
 */
export function createFakeApiKey(props?: CreateFakeApiKeysArgs): APIKeyMinimal {
    return merge(
        {
            created_at: faker.date.past().toISOString(),
            groups: [createFakeGroupMinimal()],
            id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
            name: faker.word.noun(),
            permissions: createFakePermissions({
                cancel_job: true,
                create_ref: true,
            }),
        },
        props,
    );
}

/**
 * Mocks an API call to get the users account
 *
 * @param account - The account to fetch
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetAccount(account: Account) {
    return nock("http://localhost").get("/api/account").reply(200, account);
}

/**
 * Mocks an API call for getting the API keys
 *
 * @param apiKeys - The array of API keys to return
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetAPIKeys(apiKeys: APIKeyMinimal[]) {
    return nock("http://localhost")
        .get("/api/account/keys")
        .reply(200, apiKeys);
}

/**
 * Mocks an API call for creating an API key
 *
 * @param name - The name of the API key
 * @param permissions - The permissions for the API key
 * @returns A nock scope for the mocked API call
 */
export function mockApiCreateAPIKey(name: string, permissions: Permissions) {
    const createApiKeyResponse = {
        groups: [],
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        key: "testKey",
        name,
        permissions,
    };

    return nock("http://localhost")
        .post("/api/account/keys")
        .query(true)
        .reply(201, createApiKeyResponse);
}
