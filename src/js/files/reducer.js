/**
 * Exports a reducer for managing uploaded files.
 *
 * @module files/reducer
 */
import { createReducer } from "@reduxjs/toolkit";
import { map, reject } from "lodash-es";
import {
    FIND_FILES,
    UPLOAD,
    UPLOAD_PROGRESS,
    UPLOAD_SAMPLE_FILE,
    WS_INSERT_FILE,
    WS_REMOVE_FILE,
    WS_UPDATE_FILE
} from "../app/actionTypes";
import { insert, remove, update, updateDocuments } from "../utils/reducers";

/**
 * The initial state to give the reducer.
 *
 * @const
 * @type {object}
 */
export const initialState = {
    documents: null,
    fileType: null,
    found_count: 0,
    page: 0,
    total_count: 0,
    uploads: []
};

export const appendUpload = (state, action) => {
    const { context, file, fileType, localId } = action;
    const { name, size } = file;

    return {
        ...state,
        uploads: state.uploads.concat([{ localId, progress: 0, name, size, type: fileType, context }])
    };
};

/**
 * Remove finished uploads.
 *
 * @func
 * @param state {object}
 * @returns {object}
 */
export const cleanUploads = state => ({
    ...state,
    uploads: reject(state.uploads, { progress: 100 })
});

/**
 * Update the progress for an upload.
 *
 * @param state
 * @param action
 */
export const updateProgress = (state, action) => {
    const uploads = map(state.uploads, upload => {
        if (upload.localId === action.localId) {
            return { ...upload, progress: action.progress };
        }

        return upload;
    });

    return { ...state, uploads };
};

/**
 * A reducer for managing uploaded files.
 *
 * @param state {object}
 * @param action {object}
 * @returns {object}
 */
export const filesReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_FILE, (state, action) => {
            if (action.data.type === state.fileType) {
                return insert(state, action, "uploaded_at", true);
            }
            return state;
        })
        .addCase(WS_UPDATE_FILE, (state, action) => {
            return update(state, action, "uploaded_at", true);
        })
        .addCase(WS_REMOVE_FILE, (state, action) => {
            return remove(state, action);
        })
        .addCase(FIND_FILES.REQUESTED, (state, action) => {
            state.term = action.term;
            state.documents = state.fileType === action.fileType ? state.documents : null;
            state.fileType = "";
        })
        .addCase(FIND_FILES.SUCCEEDED, (state, action) => {
            return {
                ...updateDocuments(state, action, "uploaded_at", true),
                fileType: action.context.fileType
            };
        })
        .addCase(UPLOAD.REQUESTED, (state, action) => {
            return cleanUploads(appendUpload(state, action));
        })
        .addCase(UPLOAD_SAMPLE_FILE.REQUESTED, (state, action) => {
            return cleanUploads(appendUpload(state, action));
        })
        .addCase(UPLOAD_PROGRESS, (state, action) => {
            return cleanUploads(updateProgress(state, action));
        });
});

export default filesReducer;
