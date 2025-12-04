import { Account, APIKeyMinimal, QuickAnalyzeWorkflow } from "@account/types";
import { faker } from "@faker-js/faker";
import { Permissions } from "@groups/types";
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

export function createFakeAccount(overrides?: Partial<Account>): Account {
    const { settings, email, ...userProps } = overrides || {};

    return {
        email: email ?? faker.internet.email(),
        settings: { ...defaultSettings, ...settings },
        ...createFakeUser(userProps),
    };
}

/**
 * Create a fake API key
 *
 * @param overrides - optional properties for creating a fake API key with specific values
 */
export function createFakeApiKey(
    overrides?: Partial<APIKeyMinimal>,
): APIKeyMinimal {
    return {
        created_at: faker.date.past().toISOString(),
        groups: [createFakeGroupMinimal()],
        id: faker.string.alphanumeric({ casing: "lower", length: 8 }),
        name: faker.word.noun({ strategy: "any-length" }),
        permissions: createFakePermissions({
            cancel_job: true,
            create_ref: true,
        }),
        ...overrides,
    };
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
export function mockApiGetApiKeys(apiKeys: APIKeyMinimal[]) {
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
export function mockApiCreateApiKey(name: string, permissions: Permissions) {
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
