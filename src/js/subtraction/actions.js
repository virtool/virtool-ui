import {
    CREATE_SUBTRACTION,
    EDIT_SUBTRACTION,
    FIND_SUBTRACTIONS,
    GET_SUBTRACTION,
    REMOVE_SUBTRACTION,
    SHORTLIST_SUBTRACTIONS,
    WS_INSERT_SUBTRACTION,
    WS_REMOVE_SUBTRACTION,
    WS_UPDATE_SUBTRACTION,
} from "../app/actionTypes";

import { createAction } from "@reduxjs/toolkit";
/**
 * Returns an action that should be dispatched when a subtraction document is inserted via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsInsertSubtraction = createAction(WS_INSERT_SUBTRACTION);
/**
 * Returns an action that should be dispatched when a subtraction document is updated via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsUpdateSubtraction = createAction(WS_UPDATE_SUBTRACTION);

/**
 * Returns an action that should be dispatched when a subtraction document is removed via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsRemoveSubtraction = createAction(WS_REMOVE_SUBTRACTION);

export const findSubtractions = createAction(FIND_SUBTRACTIONS.REQUESTED, (term, page) => ({
    payload: { term, page },
}));

export const shortlistSubtractions = createAction(SHORTLIST_SUBTRACTIONS.REQUESTED);

/**
 * Returns action that can trigger an API call to retrieve a subtraction.
 *
 * @func
 * @param subtractionId {string} unique subtraction id
 * @returns {object}
 */
export const getSubtraction = createAction(GET_SUBTRACTION.REQUESTED, subtractionId => ({
    payload: { subtractionId },
}));

/**
 * Returns action that can trigger an API call to create a new subtraction.
 *
 * @func
 * @param uploadId {string} the unique id of uploaded FASTA file to build the subtraction from
 * @param name {string} display name for the subtraction
 * @param nickname {string} common or nickname for the subtraction host
 * @returns {object}
 */
export const createSubtraction = createAction(CREATE_SUBTRACTION.REQUESTED, (uploadId, name, nickname) => ({
    payload: { name, nickname, uploadId },
}));

/**
 * Returns action that can trigger an API call to modify a subtraction.
 *
 * @func
 * @param subtractionId {string} unique subtraction id
 * @param name {string} a new name for the host
 * @param nickname {string} common or nickname for the subtraction host
 * @returns {object}
 */
export const editSubtraction = createAction(EDIT_SUBTRACTION.REQUESTED, (subtractionId, name, nickname) => ({
    payload: { subtractionId, name, nickname },
}));

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
