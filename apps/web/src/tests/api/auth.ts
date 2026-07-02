import type { User } from "@users/types";
import { expect, vi } from "vitest";

/**
 * Mock handles for the `@server/auth/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` so route-level tests can stub the
 * unauthenticated auth endpoints without per-file `vi.mock` boilerplate.
 */
export const authServerFnMocks = {
	loginFn: vi.fn(),
	logoutFn: vi.fn(),
	resetPasswordFn: vi.fn(),
	createFirstUserFn: vi.fn(),
};

/** Asserts that the corresponding mock was called at least once. */
export type MockScope = { done(): void };

function makeScope(fn: ReturnType<typeof vi.fn>): MockScope {
	return {
		done() {
			expect(fn).toHaveBeenCalled();
		},
	};
}

/**
 * Sets up createFirstUserFn to resolve with the given user (or reject with the
 * given message on a 4xx code, e.g. 409 when a user already exists).
 */
export function mockApiCreateFirstUser(
	user?: Partial<User>,
	statusCode = 201,
	message = "Virtool already has a user.",
): MockScope {
	if (statusCode >= 400) {
		authServerFnMocks.createFirstUserFn.mockRejectedValue(new Error(message));
	} else {
		authServerFnMocks.createFirstUserFn.mockResolvedValue(user ?? {});
	}
	return makeScope(authServerFnMocks.createFirstUserFn);
}
