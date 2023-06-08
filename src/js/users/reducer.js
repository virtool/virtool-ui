import { createReducer } from "@reduxjs/toolkit";
import {
    CREATE_USER,
    EDIT_USER,
    FIND_USERS,
    GET_USER,
    WS_INSERT_USER,
    WS_REMOVE_USER,
    WS_UPDATE_USER,
} from "../app/actionTypes";
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
        })
        .addCase(GET_USER.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_USER.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(CREATE_USER.REQUESTED, state => {
            state.createPending = true;
        })
        .addCase(CREATE_USER.SUCCEEDED, state => {
            state.createPending = false;
        })
        .addCase(CREATE_USER.FAILED, state => {
            state.createPending = false;
        })
        .addCase(EDIT_USER.REQUESTED, (state, action) => {
            if (action.payload.update.password) {
                return { ...state, passwordPending: true };
            }
            return state;
        })
        .addCase(EDIT_USER.SUCCEEDED, (state, action) => {
            return { ...state, detail: action.payload };
        });
});

export default reducer;
