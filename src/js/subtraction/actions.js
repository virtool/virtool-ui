import { createAction } from "@reduxjs/toolkit";
import { REMOVE_SUBTRACTION, SHORTLIST_SUBTRACTIONS, WS_REMOVE_SUBTRACTION } from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a subtraction document is removed via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsRemoveSubtraction = createAction(WS_REMOVE_SUBTRACTION);

export const shortlistSubtractions = createAction(SHORTLIST_SUBTRACTIONS.REQUESTED);

/**
 * Returns action that can trigger an API call to remove a subtraction.
 *
 * @func
 * @param subtractionId {string} unique subtraction id
 * @returns {object}
 */
export const removeSubtraction = createAction(REMOVE_SUBTRACTION.REQUESTED, subtractionId => ({
    payload: { subtractionId },
}));
