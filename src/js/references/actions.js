import { EDIT_REFERENCE, GET_REFERENCE, WS_UPDATE_REFERENCE } from "@app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns an action that should be dispatched when a reference is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateReference = createAction(WS_UPDATE_REFERENCE);

export const getReference = createAction(GET_REFERENCE.REQUESTED, refId => ({ payload: { refId } }));

export const editReference = createAction(EDIT_REFERENCE.REQUESTED, (refId, update) => ({
    payload: { refId, update },
}));
