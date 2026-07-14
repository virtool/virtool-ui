import type { Account, AccountSettings, APIKeyMinimal } from "@account/types";
import { faker } from "@faker-js/faker";
import type { Permissions } from "@groups/types";
import nock from "nock";
import { expect } from "vitest";
import { type MockScope, userServerFnMocks } from "../api/users";
import { createFakeGroupMinimal } from "./groups";
import { createFakePermissions } from "./permissions";
import { createFakeUser } from "./user";

const defaultSettings: AccountSettings = {
	quick_analyze_workflow: "pathoscope",
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
 * Sets up the `getAccount` server function to resolve with the given account.
 *
 * The account is served by a server function rather than the REST API, so this
 * stubs the mocked `@server/users/functions` module instead of intercepting a
 * request with nock.
 *
 * @param account - The account to fetch
 */
export function mockApiGetAccount(account: Account): MockScope {
	userServerFnMocks.getAccount.mockResolvedValue(account);

	return {
		done() {
			expect(userServerFnMocks.getAccount).toHaveBeenCalled();
		},
	};
}

/**
 * Sets up `getAccount` to reject the way it does for an anonymous caller.
 *
 * The global authentication middleware rejects an unauthenticated call with
 * `UnauthorizedError`, and the route guards on `/login` and `/_authenticated`
 * read that rejection as "nobody is signed in".
 */
export function mockApiGetAccountUnauthorized(): void {
	const error = new Error("Unauthorized");
	error.name = "UnauthorizedError";

	userServerFnMocks.getAccount.mockRejectedValue(error);
}

/**
 * Mocks an API call for getting the API keys
 *
 * @param apiKeys - The array of API keys to return
 * @returns A nock scope for the mocked API call
 */
export function mockApiGetApiKeys(apiKeys: APIKeyMinimal[]) {
	return nock("http://localhost").get("/api/account/keys").reply(200, apiKeys);
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

/**
 * Mocks a successful API call for changing the account password
 *
 * @param account - The account to return after password change
 * @returns A nock scope for the mocked API call
 */
export function mockApiChangePassword(account: Account) {
	return nock("http://localhost").patch("/api/account").reply(200, account);
}
