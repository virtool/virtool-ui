/**
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 */

import { createAction } from "@reduxjs/toolkit";
import { FIND_USERS, WS_INSERT_USER, WS_REMOVE_USER, WS_UPDATE_USER } from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a user document is inserted via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsInsertUser = createAction(WS_INSERT_USER);

/**
 * Returns an action that should be dispatched when a user document is updated via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsUpdateUser = createAction(WS_UPDATE_USER);

/**
 * Returns an action that should be dispatched when a user document is removed via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsRemoveUser = createAction(WS_REMOVE_USER);

/**
 * Returns an action that can trigger an API call for finding users.
 *
 * @func
 * @returns {object}
 */
export const findUsers = createAction(FIND_USERS.REQUESTED, (term, page) => ({
    payload: { term, page },
}));
