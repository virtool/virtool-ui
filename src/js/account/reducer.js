/**
 * Exports a reducer for dealing with the account of the session user.
 *
 * @module account/reducer
 */
import { GET_ACCOUNT } from "@app/actionTypes";
import { createReducer } from "@reduxjs/toolkit";

/**
 * The state that should initially be stored.
 *
 * @const
 * @type {object}
 */
export const initialState = {
    apiKeys: null,
    newKey: null,
    ready: false,
};

/**
 * A reducer for dealing with the account of the session user.
 *
 * @param state {object}
 * @param action {object}
 * @returns {object}
 */
export const accountReducer = createReducer(initialState, builder => {
    builder.addCase(GET_ACCOUNT.SUCCEEDED, (state, action) => {
        return { ...state, ...action.payload, ready: true };
    });
});

export default accountReducer;
