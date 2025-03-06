/**
 * Functions for requesting account data for the current user from backend
 *
 * @module account/api
 */
import { apiClient } from "@app/apiClient";
import { Permissions } from "@groups/types";
import { User } from "@users/types";
import { Response } from "superagent";
import { Account, APIKeyMinimal } from "./types";

/**
 * Gets complete account data for the current user.
 *
 * @returns A promise resolving to a response containing the
 * current user's account data.
 */
export function get(): Promise<Response> {
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
export function getSettings(): Promise<Response> {
    return apiClient.get("/account/settings");
}

/**
 * Updates the settings for the current account.
 *
 * @param update - The update to apply to account settings
 * @returns A promise resolving to a response containing the
 * user's updated personal settings.
 */
export function updateSettings({ update }): Promise<Response> {
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
export function getAPIKeys(): Promise<APIKeyMinimal[]> {
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

/**
 * Log in using the provided credentials.
 *
 * @param username - The username to log in with
 * @param password - The password to log in with
 * @param remember - Whether the sessions should be remembered for a
 * longer period of time
 * @returns A promise which resolves to a response indicating if the users
 * password must be reset and required information if it needs to be.
 */
export function login({
    username,
    password,
    remember,
}: {
    username: string;
    password: string;
    remember: boolean;
}): Promise<Response> {
    return apiClient.post("/account/login").send({
        username,
        password,
        remember,
    });
}

/**
 * Logs out the current session.
 *
 * @returns A promise which resolves to a response indicating if the
 * logout was successful.
 */
export function logout(): Promise<null> {
    return apiClient.get("/account/logout").then((res) => res.body);
}

/**
 * Reset the current users password
 *
 * @param password - The new password
 * @param resetCode - The reset code sent to the user
 * @returns A promise which resolves to a response indicating if the
 * password was successfully reset.
 */
export function resetPassword({
    password,
    resetCode,
}: {
    password: string;
    resetCode: string;
}): Promise<Response> {
    return apiClient.post("/account/reset").send({
        password,
        reset_code: resetCode,
    });
}

/**
 * Fetches account data for the logged-in user
 *
 * @returns A Promise resolving to the current user's account data
 */
export function fetchAccount(): Promise<Account> {
    return apiClient.get("/account").then((response) => response.body);
}
