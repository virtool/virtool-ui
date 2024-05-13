import { EDIT_REFERENCE, GET_REFERENCE, WS_INSERT_REFERENCE, WS_UPDATE_REFERENCE } from "@app/actionTypes";
import { createReducer } from "@reduxjs/toolkit";
import { insert, update } from "@utils/reducers";
import { assign } from "lodash-es";

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
        .addCase(GET_REFERENCE.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(EDIT_REFERENCE.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        });
});

export default referenceReducer;
