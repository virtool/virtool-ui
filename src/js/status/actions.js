import { WS_UPDATE_STATUS } from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns an action that should be dispatched when the status is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateStatus = createAction(WS_UPDATE_STATUS);
