import { createAction } from "@reduxjs/toolkit";
import { REMOVE_SUBTRACTION, SHORTLIST_SUBTRACTIONS } from "../app/actionTypes";

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
