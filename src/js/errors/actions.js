/**
 * Redux action creator for clearing errors.
 *
 * @module error/actions
 */
import { createAction } from "@reduxjs/toolkit";
import { CLEAR_ERROR } from "../app/actionTypes";

/**
 * Returns action that clears specific error in the store.
 *
 * @func
 * @returns {object}
 */
export const clearError = createAction(CLEAR_ERROR, error => ({
    payload: { error },
}));
