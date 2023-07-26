import { createAction } from "@reduxjs/toolkit";
import {
    ARCHIVE_JOB,
    CANCEL_JOB,
    FIND_JOBS,
    GET_JOB,
    WS_INSERT_JOB,
    WS_REMOVE_JOB,
    WS_UPDATE_JOB,
} from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a job document is inserted via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsInsertJob = createAction(WS_INSERT_JOB);

/**
 * Returns an action that should be dispatched when a job document is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateJob = createAction(WS_UPDATE_JOB);

/**
 * Returns an action that should be dispatched when a job document is removed via websocket.
 *
 * @func
 * @param jobId {string} the id for the specific job
 * @returns {object}
 */
export const wsRemoveJob = createAction(WS_REMOVE_JOB);

/**
 * Returns action that can trigger an API call for getting all available jobs.
 *
 * @func
 * @returns {object}
 */

export const findJobs = createAction(FIND_JOBS.REQUESTED, (states, page = 1, archived = false) => ({
    payload: { archived, states, page },
}));

/**
 * Returns action that can trigger an API call for getting a specific job document.
 *
 * @func
 * @param jobId {string} the id for the specific job
 * @returns {object}
 */
export const getJob = createAction(GET_JOB.REQUESTED, jobId => ({ payload: { jobId } }));

/**
 * Returns action that can trigger an API call for cancelling a currently running job.
 *
 * @func
 * @param jobId {string} the id for the specific job
 * @returns {object}
 */
export const cancelJob = createAction(CANCEL_JOB.REQUESTED, jobId => ({ payload: { jobId } }));

/**
 * Returns action that can trigger an API call for archiving a specific job.
 *
 * @func
 * @param jobId {string} id of the specific job
 * @returns {object}
 */
export const archiveJob = createAction(ARCHIVE_JOB.REQUESTED, jobId => ({ payload: { jobId } }));
