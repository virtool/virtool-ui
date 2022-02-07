/**
 * Exports a reducer for managing uploaded files.
 *
 * @module files/reducer
 */
import { createReducer } from "@reduxjs/toolkit";
import { forEach, map, reject } from "lodash-es";
import {
    FIND_FILES,
    UPLOAD,
    UPLOAD_PROGRESS,
    UPLOAD_FAILED,
    UPLOAD_SAMPLE_FILE,
    REMOVE_UPLOAD,
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
        uploads: state.uploads.concat([{ localId, progress: 0, name, size, type: fileType, context, failed: false }])
    };
};

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
            if (action.payload.type === state.fileType) {
                return insert(state, action.payload, "uploaded_at", true);
            }
            return state;
        })
        .addCase(WS_UPDATE_FILE, (state, action) => {
            return update(state, action.payload, "uploaded_at", true);
        })
        .addCase(WS_REMOVE_FILE, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(FIND_FILES.REQUESTED, (state, action) => {
            state.term = action.payload.term;
            state.documents = state.fileType === action.payload.fileType ? state.documents : null;
            state.fileType = "";
        })
        .addCase(FIND_FILES.SUCCEEDED, (state, action) => {
            return {
                ...updateDocuments(state, action.payload, "uploaded_at", true),
                fileType: action.context.fileType
            };
        })
        .addCase(UPLOAD.REQUESTED, (state, action) => {
            return appendUpload(state, action.payload);
        })
        .addCase(UPLOAD.SUCCEEDED, (state, action) => {
            state.uploads = reject(state.uploads, { localId: action.payload.localId });
        })
        .addCase(UPLOAD_SAMPLE_FILE.REQUESTED, (state, action) => {
            return appendUpload(state, action.payload);
        })
        .addCase(UPLOAD_PROGRESS, (state, action) => {
            return updateProgress(state, action.payload);
        })
        .addCase(UPLOAD_FAILED, (state, action) => {
            forEach(state.uploads, upload => {
                if (upload.localId === action.payload.localId) {
                    upload.failed = true;
                }
            });
        })
        .addCase(REMOVE_UPLOAD, (state, action) => {
            state.uploads = reject(state.uploads, { localId: action.payload.localId });
        });
});

export default filesReducer;
