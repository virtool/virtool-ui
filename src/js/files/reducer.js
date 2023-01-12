/**
 * Exports a reducer for managing uploaded files.
 *
 * @module files/reducer
 */
import { createReducer } from "@reduxjs/toolkit";
import { forEach, map, reject, sortBy } from "lodash-es";
import {
    FIND_FILES,
    REMOVE_UPLOAD,
    UPLOAD,
    UPLOAD_FAILED,
    UPLOAD_PROGRESS,
    UPLOAD_SAMPLE_FILE,
    WS_INSERT_FILE,
    WS_REFRESH_FILES,
    WS_REMOVE_FILE,
    WS_UPDATE_FILE
} from "../app/actionTypes";
import { insert, remove, update } from "../utils/reducers";

/**
 * The initial state to give the reducer.
 *
 * @const
 * @type {object}
 */
export const initialState = {
    items: null,
    fileType: null,
    paginate: false,
    term: "",
    found_count: 0,
    page: 0,
    total_count: 0,
    uploads: [],
    stale: true
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
            return {
                ...upload,
                progress: action.progress,
                uploadSpeed: action.uploadSpeed,
                remaining: action.remaining
            };
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
        .addCase(WS_UPDATE_FILE, (state, action) => {
            return update(state, action.payload, "uploaded_at", true);
        })
        .addCase(WS_REFRESH_FILES.SUCCEEDED, (state, action) => {
            if (state.fileType === action.context.fileType) {
                return {
                    ...state,
                    ...action.payload,
                    items: sortBy(action.payload.items || action.payload.documents, "uploaded_at").reverse()
                };
            }
        })
        .addCase(FIND_FILES.REQUESTED, (state, action) => {
            state.term = action.payload.term;
            state.items = state.fileType === action.payload.fileType ? state.items : null;
            state.paginate = action.payload.paginate;
        })
        .addCase(FIND_FILES.SUCCEEDED, (state, action) => {
            return {
                ...state,
                ...action.payload,
                items: sortBy(action.payload.items || action.payload.documents, "uploaded_at").reverse(),
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
