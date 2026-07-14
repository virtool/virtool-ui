import { DEFAULT_MINIMUM_PASSWORD_LENGTH } from "@server/auth/passwordPolicy";
import { type Mock, vi } from "vitest";

/**
 * Mock handles for the `@server/settings/functions` server-fn module. Wired in
 * globally from `tests/setup.tsx` because every password form queries the
 * policy, including the unauthenticated ones.
 */
export const settingsServerFnMocks = {
	getPasswordPolicyFn: vi.fn(),
};

/** Set the minimum password length the password forms will validate against. */
export function mockGetPasswordPolicy(
	minimumPasswordLength: number = DEFAULT_MINIMUM_PASSWORD_LENGTH,
): Mock {
	settingsServerFnMocks.getPasswordPolicyFn.mockResolvedValue({
		minimumPasswordLength,
	});
	return settingsServerFnMocks.getPasswordPolicyFn;
}
