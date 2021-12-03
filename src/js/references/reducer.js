import { createReducer } from "@reduxjs/toolkit";
import { assign, concat, reject, set, union, without } from "lodash-es";
import {
    ADD_REFERENCE_GROUP,
    ADD_REFERENCE_USER,
    CHECK_REMOTE_UPDATES,
    EDIT_REFERENCE,
    EDIT_REFERENCE_GROUP,
    EDIT_REFERENCE_USER,
    FIND_REFERENCES,
    GET_REFERENCE,
    REMOVE_REFERENCE_GROUP,
    REMOVE_REFERENCE_USER,
    UPDATE_REMOTE_REFERENCE,
    UPLOAD,
    UPLOAD_PROGRESS,
    WS_INSERT_REFERENCE,
    WS_REMOVE_REFERENCE,
    WS_UPDATE_REFERENCE
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
    pendingRemoveUsers: []
};

export const referenceReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_REFERENCE, (state, action) => {
            const updated = insert(state, action, "name");
            return {
                ...updated
            };
        })
        .addCase(WS_UPDATE_REFERENCE, (state, action) => {
            const updated = update(state, action, "name");

            if (state.detail && state.detail.id === action.data.id) {
                state.detail = { ...state.detail, ...action.data };
            } else {
                assign(state, updated);
            }
        })
        .addCase(WS_REMOVE_REFERENCE, (state, action) => {
            return remove(state, action);
        })
        .addCase(FIND_REFERENCES.REQUESTED, (state, action) => {
            state.term = action.term;
        })
        .addCase(FIND_REFERENCES.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action, "name");
        })
        .addCase(GET_REFERENCE.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_REFERENCE.SUCCEEDED, (state, action) => {
            state.detail = action.data;
        })
        .addCase(EDIT_REFERENCE.SUCCEEDED, (state, action) => {
            state.detail = action.data;
        })
        .addCase(UPLOAD.REQUESTED, (state, action) => {
            if (action.fileType === "reference") {
                state.importFile = null;
                state.importUploadId = action.localId;
                state.importUploadName = action.name;
                state.importUploadProgress = 0;
            }

            return state;
        })
        .addCase(UPLOAD.SUCCEEDED, (state, action) => {
            if (state.importUploadId === action.data.localId) {
                state.importFile = action.data;
                state.importUploadId = null;
                state.importUploadName = null;
                state.importUploadProgress = 0;
            }
        })
        .addCase(UPLOAD.FAILED, (state, action) => {
            if (action.fileType === "reference") {
                state.importFile = null;
                state.importUploadId = null;
                state.importUploadProgress = 0;
            }
        })
        .addCase(UPLOAD_PROGRESS, (state, action) => {
            if (state.importUploadId === action.localId) {
                state.importUploadProgress = action.progress;
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
            set(state, "detail.release", action.data);
        })
        .addCase(UPDATE_REMOTE_REFERENCE.SUCCEEDED, (state, action) => {
            set(state, "detail.release", action.data);
        })
        .addCase(ADD_REFERENCE_USER.SUCCEEDED, (state, action) => {
            state.detail.users = concat(state.detail.users, [action.data]);
        })
        .addCase(EDIT_REFERENCE_USER.SUCCEEDED, (state, action) => {
            state.detail.users = updateMember(state.detail.users, action);
        })
        .addCase(REMOVE_REFERENCE_USER.REQUESTED, (state, action) => {
            if (action.refId === state.detail.id) {
                state.pendingRemoveUsers = union(state.pendingRemoveUsers, [action.userId]);
            }
        })
        .addCase(REMOVE_REFERENCE_USER.SUCCEEDED, (state, action) => {
            if (action.context.refId === state.detail.id) {
                const userId = action.context.userId;
                state.pendingRemoveUsers = without(state.pendingRemoveUsers, userId);
                state.detail.users = reject(state.detail.users, { id: userId });
            }
        })
        .addCase(ADD_REFERENCE_GROUP.SUCCEEDED, (state, action) => {
            state.detail.groups = concat(state.detail.groups, [action.data]);
        })
        .addCase(EDIT_REFERENCE_GROUP.SUCCEEDED, (state, action) => {
            state.detail.groups = updateMember(state.detail.groups, action);
        })
        .addCase(REMOVE_REFERENCE_GROUP.REQUESTED, (state, action) => {
            if (action.refId === state.detail.id) {
                state.pendingRemoveGroups = union(state.pendingRemoveGroups, [action.groupId]);
            }
        })
        .addCase(REMOVE_REFERENCE_GROUP.SUCCEEDED, (state, action) => {
            if (action.context.refId === state.detail.id) {
                const groupId = action.context.groupId;
                state.pendingRemoveGroups = without(state.pendingRemoveGroups, groupId);
                state.detail.groups = reject(state.detail.groups, { id: groupId });
            }
        });
});

export default referenceReducer;
