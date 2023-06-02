/**
 * Defines methods used for calling account API endpoints.
 *
 * @module account/api
 */

import { Request } from "../app/request";

/**
 * Gets the complete data for the current account.
 *
 * @func
 * @returns {promise}
 */
export const get = () => Request.get("/account");

/**
 * Updates the complete data for the current account.
 *
 * @func
 * @param update {object} the update to apply to current account.
 * @returns {promise}
 */
export const update = ({ update }) => Request.patch("/account").send(update);

/**
 * Gets the settings object for the current account.
 *
 * @func
 * @returns {promise}
 */
export const getSettings = () => Request.get("/account/settings");

/**
 * Updates the settings for the current account.
 *
 * @func
 * @param update {object} the update to apply to account settings
 * @returns {promise}
 */
export const updateSettings = ({ update }) => Request.patch("/account/settings").send(update);

/**
 * Changes the password for the current account.
 *
 * @func
 * @param oldPassword {string} the old password (for verification)
 * @param newPassword {string} the new password
 * @returns {promise}
 */
export const changePassword = ({ old_password, password }) =>
    Request.patch("/account").send({
        old_password,
        password,
    });

/**
 * Gets all API keys owned by the current account.
 *
 * @returns {promise}
 */
export const getAPIKeys = () => Request.get("/account/keys");

/**
 * Create a new API key for the current account.
 *
 * @func
 * @param name {string} a name for the API key
 * @param permissions {object} the permissions to assign to the API key
 * @returns {promise}
 */
export const createAPIKey = ({ name, permissions }) =>
    Request.post("/account/keys").send({
        name,
        permissions,
    });

/**
 * Update the permissions for an existing API key owned by the current account.
 *
 * @func
 * @param keyId {string} the unique id for the API key to update
 * @param permissions {object} the new permissions for the API key
 * @returns {promise}
 */
export const updateAPIKey = ({ keyId, permissions }) =>
    Request.patch(`/account/keys/${keyId}`).send({
        permissions,
    });

/**
 * Remove an existing API key owned by current account.
 *
 * @param keyId
 * @returns {promise}
 */
export const removeAPIKey = ({ keyId }) => Request.delete(`/account/keys/${keyId}`);

export const login = ({ username, password, remember }) =>
    Request.post("/account/login").send({ username, password, remember });

/**
 * Logs out the current session.
 *
 * @func
 * @returns {promise}
 */
export const logout = () => Request.get("/account/logout");

export const resetPassword = ({ password, resetCode }) =>
    Request.post("/account/reset").send({ password, reset_code: resetCode });
