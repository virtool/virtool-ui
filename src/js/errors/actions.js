/**
 * Redux action creator for clearing errors.
 *
 * @module error/actions
 */
import { CLEAR_ERROR } from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns action that clears specific error in the store.
 *
 * @func
 * @returns {object}
 */
export const clearError = createAction(CLEAR_ERROR, error => ({
    payload: { error }
}));
