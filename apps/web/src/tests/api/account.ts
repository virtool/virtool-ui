import type { Account } from "@account/types";
import type { Account as ServerAccount } from "@server/account/data";
// @server/account/functions is globally mocked in tests/setup.tsx; this import
// resolves to the mock object at runtime, never to the real server module.
import { getAccount } from "@server/account/functions";
import { vi } from "vitest";

/**
 * Configures the getAccount server function mock to resolve with the given account.
 *
 * @param account - The account to return
 */
export function mockApiGetAccount(account: Account) {
	vi.mocked(getAccount).mockResolvedValue(account as unknown as ServerAccount);
}
