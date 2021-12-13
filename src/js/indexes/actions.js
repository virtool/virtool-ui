import {
    WS_INSERT_INDEX,
    WS_UPDATE_INDEX,
    FIND_INDEXES,
    GET_INDEX,
    GET_UNBUILT,
    CREATE_INDEX,
    GET_INDEX_HISTORY,
    LIST_READY_INDEXES,
    WS_INSERT_HISTORY
} from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns an action that should be dispatched when a history document is inserted via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsInsertHistory = createAction(WS_INSERT_HISTORY);

/**
 * Returns an action that should be dispatched when an index document is inserted via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsInsertIndex = createAction(WS_INSERT_INDEX);

/**
 * Returns an action that should be dispatched when an index document is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateIndex = createAction(WS_UPDATE_INDEX);

/**
 * Returns action that can trigger an API call for getting available OTU indexes.
 *
 * @func
 * @returns {object}
 */
export const findIndexes = createAction(FIND_INDEXES.REQUESTED, (refId, term, page) => ({
    payload: { refId, term, page }
}));

/**
 * Returns action that can trigger an API call for getting all ready OTU indexes.
 *
 * @func
 * @returns {object}
 */
export const listReadyIndexes = createAction(LIST_READY_INDEXES.REQUESTED);

/**
 * Returns action that can trigger an API call for getting specific OTU index.
 *
 * @func
 * @param indexId {string} the unique index id.
 * @returns {object}
 */
export const getIndex = createAction(GET_INDEX.REQUESTED, indexId => ({ payload: { indexId } }));

/**
 * Returns action that can trigger an API call for getting unbuilt data.
 *
 * @func
 * @returns {object}
 */
export const getUnbuilt = createAction(GET_UNBUILT.REQUESTED, refId => ({ payload: { refId } }));

/**
 * Returns action that can trigger an API call for creating a new OTU index.
 *
 * @func
 * @returns {object}
 */
export const createIndex = createAction(CREATE_INDEX.REQUESTED, refId => ({ payload: { refId } }));

/**
 * Returns action that can trigger an API call for getting a specific page in the index version history.
 *
 * @func
 * @param indexId {string} the unique index id.
 * @param page {number} the page to retrieve from the list of changes.
 * @returns {object}
 */
export const getIndexHistory = createAction(GET_INDEX_HISTORY.REQUESTED, (indexId, page) => ({
    payload: { indexId, page }
}));
