/**
 * Redux action creators for use with file management.
 *
 * @module files/actions
 */

import { createAction } from "@reduxjs/toolkit";
import { REMOVE_UPLOAD, UPLOAD, UPLOAD_FAILED, UPLOAD_PROGRESS } from "../app/actionTypes";

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
        context,
    },
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
    payload: { localId, progress, uploadSpeed, remaining },
}));

/**
 * Returns and action that sets the status of an ongoing upload to failed
 *
 * @func
 * @param localId {string} the local id for the upload (NOT the fileId)
 * @returns {object}
 */
export const uploadFailed = createAction(UPLOAD_FAILED, localId => ({
    payload: { localId },
}));

/**
 * Returns and action that triggers the removal of the upload file specified
 *
 * @func
 * @param localId {string} the local id for the upload (NOT the fileId)
 * @returns {object}
 */
export const removeUpload = createAction(REMOVE_UPLOAD, localId => ({
    payload: { localId },
}));
