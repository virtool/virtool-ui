/**
 * Redux action creators for use with the active user account.
 *
 * @module account/actions
 */
import { GET_ACCOUNT, LOGIN, RESET_PASSWORD } from "@app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns action that can trigger an API call for getting the current account data.
 *
 * @func
 * @returns {object}
 */
export const getAccount = createAction(GET_ACCOUNT.REQUESTED);

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
 * Returns action that can trigger an API call that will reset the password for the user associated with the  current
 * session.
 *
 * @func
 * @returns {object}
 */
export const resetPassword = createAction(RESET_PASSWORD.REQUESTED, (password, resetCode) => ({
    payload: { password, resetCode },
}));
