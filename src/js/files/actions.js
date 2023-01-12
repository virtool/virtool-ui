/**
 * Redux action creators for use with file management.
 *
 * @module files/actions
 */

import {
    WS_INSERT_FILE,
    WS_UPDATE_FILE,
    WS_REMOVE_FILE,
    FIND_FILES,
    REMOVE_FILE,
    UPLOAD,
    UPLOAD_PROGRESS,
    UPLOAD_FAILED,
    REMOVE_UPLOAD
} from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const wsInsertFile = createAction(WS_INSERT_FILE, data => ({
    payload: { ...data }
}));

/**
 * Returns an action that should be dispatched when a file document is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateFile = createAction(WS_UPDATE_FILE, data => ({
    payload: { ...data }
}));

/**
 * Returns an action that should be dispatched when a file document is removed via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsRemoveFile = createAction(WS_REMOVE_FILE, data => ({
    payload: { ...data }
}));

/**
 * Returns an action that can trigger an API call that finds file documents.
 *
 * @func
 * @param fileType {string} a file type to filter the returned documents by
 * @param term {number} search term to filter by
 * @param pagination {boolean} should the results by paginated
 * @param page {number} which page of results to return
 * @returns {object}
 */
export const findFiles = createAction(FIND_FILES.REQUESTED, (fileType, term, paginate, page) => ({
    payload: {
        fileType,
        term,
        paginate,
        page
    }
}));

/**
 * Returns an action that can trigger the upload of a file to the server.
 *
 * @func
 * @param localId {string} the local id for the upload (NOT the fileId)
 * @param file {object} file to be uploaded
 * @param fileType {string} file type
 * @param context {object} extra information to attach to the upload object
 * @returns {object}
 */
export const upload = createAction(UPLOAD.REQUESTED, (localId, file, fileType, context = {}) => ({
    payload: {
        localId,
        file,
        fileType,
        context
    }
}));

/**
 * Returns an action that can trigger an API call that removes a file by its fileId.
 *
 * @func
 * @param fileId {string} the unique id for the file
 * @returns {object}
 */
export const removeFile = createAction(REMOVE_FILE.REQUESTED, fileId => ({
    payload: { fileId }
}));

/**
 * Returns and action that updates the progress of an ongoing upload.
 *
 * @func
 * @param localId {string} the local id for the upload (NOT the fileId)
 * @param progress {number} the new progress value
 * @returns {object}
 */
export const uploadProgress = createAction(UPLOAD_PROGRESS, (localId, progress, uploadSpeed, remaining) => ({
    payload: { localId, progress, uploadSpeed, remaining }
}));

/**
 * Returns and action that sets the status of an ongoing upload to failed
 *
 * @func
 * @param localId {string} the local id for the upload (NOT the fileId)
 * @returns {object}
 */
export const uploadFailed = createAction(UPLOAD_FAILED, localId => ({
    payload: { localId }
}));

/**
 * Returns and action that triggers the removal of the upload file specified
 *
 * @func
 * @param localId {string} the local id for the upload (NOT the fileId)
 * @returns {object}
 */
export const removeUpload = createAction(REMOVE_UPLOAD, localId => ({
    payload: { localId }
}));
