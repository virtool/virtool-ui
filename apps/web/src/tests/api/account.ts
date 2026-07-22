import type { Account } from "@account/types";
import nock from "nock";

/**
 * Mocks a successful API call for changing the account password
 *
 * @param account - The account to return after password change
 * @returns A nock scope for the mocked API call
 */
export function mockApiChangePassword(account: Account) {
	return nock("http://localhost").patch("/api/account").reply(200, account);
}
