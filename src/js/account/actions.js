/**
 * Redux action creators for use with the active user account.
 *
 * @module account/actions
 */
import { createAction } from "@reduxjs/toolkit";
import {
    CHANGE_ACCOUNT_PASSWORD,
    CLEAR_API_KEY,
    CREATE_API_KEY,
    GET_ACCOUNT,
    GET_API_KEYS,
    LOGIN,
    LOGOUT,
    REMOVE_API_KEY,
    RESET_PASSWORD,
    UPDATE_ACCOUNT,
    UPDATE_ACCOUNT_SETTINGS,
    UPDATE_API_KEY,
} from "@app/actionTypes";

/**
 * Returns action that can trigger an API call for getting the current account data.
 *
 * @func
 * @returns {object}
 */
export const getAccount = createAction(GET_ACCOUNT.REQUESTED);

/**
 * Returns an action that can trigger an API call for updating the current account.
 *
 * @func
 * @param update {object} the update to apply to the account
 * @returns {object}
 */
export const updateAccount = createAction(UPDATE_ACCOUNT.REQUESTED, update => ({
    payload: { update },
}));

/**
 * Returns an action that can trigger an API call for updating the settings for the current account.
 *
 * @func
 * @param update {object} the update to apply to the account
 * @returns {object}
 */
export const updateAccountSettings = createAction(UPDATE_ACCOUNT_SETTINGS.REQUESTED, update => ({
    payload: { update },
}));

/**
 * Returns an action that can trigger an API call for changing the password for the current account.
 *
 * @func
 * @param oldPassword {string} the old account password (used for verification)
 * @param newPassword {string} the new account password
 * @returns {object}
 */
export const changePassword = createAction(CHANGE_ACCOUNT_PASSWORD.REQUESTED, (oldPassword, newPassword) => ({
    payload: { old_password: oldPassword, password: newPassword },
}));

/**
 * Returns action that can trigger an API call for getting the API keys owned by the current account.
 *
 * @func
 * @returns {object}
 */
export const getAPIKeys = createAction(GET_API_KEYS.REQUESTED);

/**
 * Returns action that can trigger an API call for creating a new API key for the current account.
 *
 * @func
 * @param name {string} a name for the API key
 * @param permissions {object} permissions configuration object for the new API key
 * @returns {object}
 */
export const createAPIKey = createAction(CREATE_API_KEY.REQUESTED, (name, permissions) => ({
    payload: { name, permissions },
}));

/**
 * Clears temporarily stored new API keys.
 *
 * @func
 * @returns {object}
 */
export const clearAPIKey = createAction(CLEAR_API_KEY);

/**
 * Returns action that can trigger an API call for updating the permissions for an API key owned by the current account.
 *
 * @func
 * @param keyId {string} the unique id for the API key
 * @param permissions {object} permissions configuration object for the new API key
 * @returns {object}
 */
export const updateAPIKey = createAction(UPDATE_API_KEY.REQUESTED, (keyId, permissions) => ({
    payload: { keyId, permissions },
}));

/**
 * Returns action that can trigger an API call for removing an API key owned by the current account.
 *
 * @func
 * @param keyId {string} the unique id for the API key
 * @returns {object}
 */
export const removeAPIKey = createAction(REMOVE_API_KEY.REQUESTED, keyId => ({
    payload: { keyId },
}));

/**
 * Returns action that can trigger an API call that will login into a new session.
 *
 * @func
 * @returns {object}
 */
export const login = createAction(LOGIN.REQUESTED, (username, password, remember) => ({
    payload: { username, password, remember },
}));

/**
 * Returns action that updates the redux store to assume the user is logged in
 *
 * @func
 * @returns {object}
 */
export const loginSucceeded = createAction(LOGIN.SUCCEEDED, () => ({
    payload: {
        reset: false,
    },
}));

/**
 * Returns action that can trigger an API call that will logout the current session.
 *
 * @func
 * @returns {object}
 */
export const logout = createAction(LOGOUT.REQUESTED);

/**
 * Returns action that can trigger an API call that will reset the password for the user associated with the  current
 * session.
 *
 * @func
 * @returns {object}
 */
export const resetPassword = createAction(RESET_PASSWORD.REQUESTED, (password, resetCode) => ({
    payload: { password, resetCode },
}));
