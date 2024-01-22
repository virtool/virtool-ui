import { createReducer } from "@reduxjs/toolkit";
import { assign, concat, set } from "lodash-es";
import {
    ADD_REFERENCE_GROUP,
    ADD_REFERENCE_USER,
    CHECK_REMOTE_UPDATES,
    EDIT_REFERENCE,
    EDIT_REFERENCE_GROUP,
    EDIT_REFERENCE_USER,
    FIND_REFERENCES,
    GET_REFERENCE,
    REMOTE_REFERENCE,
    UPDATE_REMOTE_REFERENCE,
    UPLOAD,
    UPLOAD_PROGRESS,
    WS_INSERT_REFERENCE,
    WS_REMOVE_REFERENCE,
    WS_UPDATE_REFERENCE,
} from "../app/actionTypes";
import { insert, remove, update, updateDocuments, updateMember } from "../utils/reducers";

export const initialState = {
    term: "",
    history: null,
    documents: null,
    page: 0,
    total_count: 0,
    detail: null,
    checking: false,
    importFileId: null,
    importFileName: null,
    importUploadId: null,
    importUploadProgress: 0,
    pendingRemoveGroups: [],
    pendingRemoveUsers: [],
};

export const referenceReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_REFERENCE, (state, action) => {
            const updated = insert(state, action.payload, "name");
            return {
                ...updated,
            };
        })
        .addCase(WS_UPDATE_REFERENCE, (state, action) => {
            assign(state, update(state, action.payload, "name"));
        })
        .addCase(WS_REMOVE_REFERENCE, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(FIND_REFERENCES.REQUESTED, (state, action) => {
            state.term = action.payload.term;
        })
        .addCase(FIND_REFERENCES.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "name");
        })
        .addCase(GET_REFERENCE.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(EDIT_REFERENCE.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(UPLOAD.REQUESTED, (state, action) => {
            if (action.payload.fileType === "reference") {
                state.importFile = null;
                state.importUploadId = action.payload.localId;
                state.importUploadName = action.payload.name;
                state.importUploadProgress = 0;
            }

            return state;
        })
        .addCase(UPLOAD.SUCCEEDED, (state, action) => {
            if (state.importUploadId === action.payload.localId) {
                state.importFile = action.payload;
                state.importUploadId = null;
                state.importUploadName = null;
                state.importUploadProgress = 0;
            }
        })
        .addCase(UPLOAD.FAILED, (state, action) => {
            if (action.payload.fileType === "reference") {
                state.importFile = null;
                state.importUploadId = null;
                state.importUploadProgress = 0;
            }
        })
        .addCase(UPLOAD_PROGRESS, (state, action) => {
            if (state.importUploadId === action.payload.localId) {
                state.importUploadProgress = action.payload.progress;
            }
        })
        .addCase(CHECK_REMOTE_UPDATES.REQUESTED, state => {
            state.checking = true;
        })
        .addCase(CHECK_REMOTE_UPDATES.FAILED, state => {
            state.checking = false;
        })
        .addCase(CHECK_REMOTE_UPDATES.SUCCEEDED, (state, action) => {
            state.checking = false;
            set(state, "detail.release", action.payload);
        })
        .addCase(UPDATE_REMOTE_REFERENCE.SUCCEEDED, (state, action) => {
            set(state, "detail.release", action.payload);
        })
        .addCase(ADD_REFERENCE_USER.SUCCEEDED, (state, action) => {
            state.detail.users = concat(state.detail.users, [action.payload]);
        })
        .addCase(EDIT_REFERENCE_USER.SUCCEEDED, (state, action) => {
            state.detail.users = updateMember(state.detail.users, action.payload);
        })
        .addCase(ADD_REFERENCE_GROUP.SUCCEEDED, (state, action) => {
            state.detail.groups = concat(state.detail.groups, [action.payload]);
        })
        .addCase(EDIT_REFERENCE_GROUP.SUCCEEDED, (state, action) => {
            state.detail.groups = updateMember(state.detail.groups, action.payload);
        })
        .addCase(REMOTE_REFERENCE.SUCCEEDED, state => {
            state.official_installed = true;
        });
});

export default referenceReducer;
