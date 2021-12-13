/**
 * @copyright 2017 Government of Canada
 * @license MIT
 * @author igboyes
 */

import {
    WS_INSERT_USER,
    WS_UPDATE_USER,
    WS_REMOVE_USER,
    FIND_USERS,
    GET_USER,
    CREATE_USER,
    EDIT_USER,
    REMOVE_USER,
    CREATE_FIRST_USER
} from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

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
    payload: { term, page }
}));

export const getUser = createAction(GET_USER.REQUESTED, userId => ({ payload: { userId } }));

/**
 * Returns action that can trigger an API call for creating a new user.
 *
 * @func
 * @param data {object} data used to create a new user
 * @returns {object}
 */
export const createUser = createAction(CREATE_USER.REQUESTED);

export const createFirstUser = createAction(CREATE_FIRST_USER.REQUESTED, (handle, password) => ({
    payload: { handle, password }
}));

/**
 * Returns action that can trigger an API call for modifying an existing user.
 *
 * @func
 * @param userId {string} unique user id
 * @param update {object} key-value pairs of new user properties
 * @returns {object}
 */
export const editUser = createAction(EDIT_USER.REQUESTED, (userId, update) => ({
    payload: { userId, update }
}));

export const removeUser = createAction(REMOVE_USER.REQUESTED, userId => ({ payload: { userId } }));
