import type { ApiKey } from "@account/types";
import type { Permissions } from "@groups/types";
import { type Mock, vi } from "vitest";
import { createFakeApiKey } from "../fake/account";

/**
 * Mock handles for the `@server/account/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so any test rendering the API-key management
 * view can stub them without per-file `vi.mock` boilerplate.
 */
export const accountServerFnMocks = {
	findApiKeys: vi.fn(),
	createApiKey: vi.fn(),
	updateApiKey: vi.fn(),
	deleteApiKey: vi.fn(),
};

/** Sets up findApiKeys to resolve with the given API keys. */
export function mockFindApiKeys(apiKeys: ApiKey[]): Mock {
	accountServerFnMocks.findApiKeys.mockResolvedValue(apiKeys);
	return accountServerFnMocks.findApiKeys;
}

/**
 * Sets up createApiKey to resolve with a created key carrying the given raw
 * secret and permissions.
 */
export function mockCreateApiKey(
	key: string,
	permissions: Permissions,
	overrides?: Partial<ApiKey>,
): Mock {
	accountServerFnMocks.createApiKey.mockResolvedValue({
		...createFakeApiKey({ permissions, ...overrides }),
		key,
	});
	return accountServerFnMocks.createApiKey;
}
