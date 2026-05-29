import { type ApiResponse, apiClient } from "@app/api";
import type { Permissions } from "@groups/types";
import { getAccount } from "@server/account/functions";
import { loginFn, logoutFn, resetPasswordFn } from "@server/auth/functions";
import type { User } from "@users/types";
import type { Account, AccountSettings, APIKeyMinimal } from "./types";

/** Result of a successful password reset. */
export type ResetPasswordResult = {
	login: false;
	reset: false;
};

/**
 * Gets complete account data for the current user.
 *
 * @returns A promise resolving to a response containing the
 * current user's account data.
 */
export function get(): Promise<ApiResponse> {
	return apiClient.get("/account");
}

export type AccountUpdate = {
	email?: string;
};

/**
 * Updates the complete data for the current account.
 *
 * @param update - The update to apply to current account.
 * @returns A promise resolving to a response containing the updated
 * user's account data
 */
export function updateAccount(update: AccountUpdate): Promise<User> {
	return apiClient
		.patch("/account")
		.send({ update })
		.then((res) => res.body);
}

/**
 * Gets the settings object for the current account.
 *
 * @returns A promise resolving to a response containing the
 * current user's personal settings.
 */
export function getSettings(): Promise<ApiResponse> {
	return apiClient.get("/account/settings");
}

/**
 * Updates the settings for the current account.
 *
 * @param update - The update to apply to account settings
 * @returns A promise resolving to a response containing the
 * user's updated personal settings.
 */
export function updateSettings({
	update,
}: {
	update: Partial<AccountSettings>;
}): Promise<ApiResponse> {
	return apiClient.patch("/account/settings").send(update);
}

/**
 * Changes the password for the current account.
 *
 * @param old_password - The old password (for verification)
 * @param password - The new password
 * @returns A promise resolving to a response indicating if the
 * password was successfully changed.
 */
export function changePassword(
	old_password: string,
	password: string,
): Promise<User> {
	return apiClient
		.patch("/account")
		.send({
			old_password,
			password,
		})
		.then((res) => res.body);
}

/**
 * Gets all API keys owned by the current account.
 *
 * @returns A promise resolving to a response containing the
 * current user's API keys.
 */
export function getApiKeys(): Promise<APIKeyMinimal[]> {
	return apiClient.get("/account/keys").then((res) => res.body);
}

/**
 * Create a new API key for the current account.
 *
 * @param name - a name for the API key
 * @param permissions - Complete list of permissions for the API key
 * @returns A promise resolving to a response containing the newly created API key
 */
export function createAPIKey(
	name: string,
	permissions: Permissions,
): Promise<APIKeyMinimal> {
	return apiClient
		.post("/account/keys")
		.send({
			name,
			permissions,
		})
		.then((res) => res.body);
}

/**
 * Update the permissions for an existing API key owned by the current account.
 *
 * @param keyId - The unique id for the API key to update
 * @param permissions - The new permissions for the API key
 * @returns A promise resolving to a response containing the updated API key
 */
export function updateAPIKey(
	keyId: string,
	permissions: Permissions,
): Promise<APIKeyMinimal> {
	return apiClient
		.patch(`/account/keys/${keyId}`)
		.send({
			permissions,
		})
		.then((res) => res.body);
}

/**
 * Remove an existing API key owned by current account.
 *
 * @param keyId - The unique id of the API key to remove
 * @returns A promise which resolves to a response indicating if the API key was successfully removed
 */
export function removeAPIKey(keyId: string): Promise<null> {
	return apiClient.delete(`/account/keys/${keyId}`).then((res) => res.body);
}

/** Result of a login attempt. `reset_code` is only set when `reset` is true. */
export type LoginResult = {
	reset: boolean;
	reset_code?: string;
};

/**
 * Log in using the provided credentials.
 *
 * @param handle - The user handle to log in with
 * @param password - The password to log in with
 * @param remember - Whether the sessions should be remembered for a
 * longer period of time
 * @returns A promise which resolves to a result indicating whether the user's
 * password must be reset; if so, `reset_code` is included.
 */
export function login({
	handle,
	password,
	remember,
}: {
	handle: string;
	password: string;
	remember: boolean;
}): Promise<LoginResult> {
	return loginFn({ data: { handle, password, remember } });
}

/**
 * Logs out the current session.
 *
 * @returns A promise which resolves once the session has been invalidated.
 */
export function logout(): Promise<null> {
	return logoutFn();
}

/**
 * Reset the current users password
 *
 * @param password - The new password
 * @param resetCode - The reset code sent to the user
 * @returns A promise which resolves to a result indicating the user is now
 * authenticated.
 */
export function resetPassword({
	password,
	resetCode,
}: {
	password: string;
	resetCode: string;
}): Promise<ResetPasswordResult> {
	return resetPasswordFn({ data: { password, reset_code: resetCode } });
}

/**
 * Fetches account data for the logged-in user.
 *
 * @returns A Promise resolving to the current user's account data
 */
export function fetchAccount(): Promise<Account> {
	// The server function models `administrator_role` and `primary_group` as
	// nullable — their real shape — while the client `Account` type does not.
	// The shapes are otherwise identical, so we narrow at this boundary.
	return getAccount() as Promise<Account>;
}
