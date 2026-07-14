import type { Account, APIKeyMinimal } from "@account/types";
import { faker } from "@faker-js/faker";
import type { Permissions } from "@groups/types";
import nock from "nock";

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
