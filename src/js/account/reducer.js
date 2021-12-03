/**
 * Exports a reducer for dealing with the account of the session user.
 *
 * @module account/reducer
 */
import { createReducer } from "@reduxjs/toolkit";
import {
    CLEAR_API_KEY,
    CREATE_API_KEY,
    GET_ACCOUNT,
    GET_API_KEYS,
    LOGOUT,
    UPDATE_ACCOUNT,
    UPDATE_ACCOUNT_SETTINGS
} from "../app/actionTypes";

/**
 * The state that should initially be stored.
 *
 * @const
 * @type {object}
 */
export const initialState = {
    apiKeys: null,
    newKey: null,
    ready: false
};

/**
 * A reducer for dealing with the account of the session user.
 *
 * @param state {object}
 * @param action {object}
 * @returns {object}
 */
export const accountReducer = createReducer(initialState, builder => {
    builder
        .addCase(GET_ACCOUNT.SUCCEEDED, (state, action) => {
            return { ...state, ...action.data, ready: true };
        })
        .addCase(UPDATE_ACCOUNT.SUCCEEDED, (state, action) => {
            return { ...state, ...action.data };
        })
        .addCase(GET_API_KEYS.SUCCEEDED, (state, action) => {
            state.apiKeys = action.data;
        })
        .addCase(CREATE_API_KEY.REQUESTED, state => {
            state.key = null;
        })
        .addCase(CREATE_API_KEY.SUCCEEDED, (state, action) => {
            state.newKey = action.data.key;
        })
        .addCase(CLEAR_API_KEY, state => {
            state.newKey = null;
        })
        .addCase(UPDATE_ACCOUNT_SETTINGS.SUCCEEDED, (state, action) => {
            state.settings = action.data;
        })
        .addCase(LOGOUT.SUCCEEDED, () => {
            return { ...initialState };
        });
});

export default accountReducer;
