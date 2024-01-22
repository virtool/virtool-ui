import { createReducer } from "@reduxjs/toolkit";
import { FIND_USERS, WS_INSERT_USER, WS_REMOVE_USER, WS_UPDATE_USER } from "../app/actionTypes";
import { insert, remove, update, updateDocuments } from "../utils/reducers";

export const initialState = {
    documents: null,
    term: "",
    page: 1,
    detail: null,
    createPending: false,
    passwordPending: false,
};

const reducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_USER, (state, action) => {
            return insert(state, action.payload, "handle");
        })
        .addCase(WS_UPDATE_USER, (state, action) => {
            return update(state, action.payload, "handle");
        })
        .addCase(WS_REMOVE_USER, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(FIND_USERS.REQUESTED, (state, action) => {
            state.term = action.payload.term;
        })
        .addCase(FIND_USERS.SUCCEEDED, (state, action) => {
            const { documents, ...rest } = action.payload;
            return updateDocuments(state, { ...rest, documents }, "handle");
        });
});

export default reducer;
