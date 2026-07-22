import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/root/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so route-level tests can stub the
 * unauthenticated root document without per-file `vi.mock` boilerplate.
 */
export const rootServerFnMocks = {
	getRoot: vi.fn(),
};

/**
 * Sets up getRoot to resolve with the given root document. `version` defaults to
 * the build version so callers that only care about `first_user` can omit it.
 */
export function mockGetRoot(root: {
	first_user: boolean;
	version?: string;
}): Mock {
	rootServerFnMocks.getRoot.mockResolvedValue({
		version: __APP_VERSION__,
		...root,
	});
	return rootServerFnMocks.getRoot;
}
