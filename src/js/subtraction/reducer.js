import { createReducer } from "@reduxjs/toolkit";
import {
    EDIT_SUBTRACTION,
    FIND_SUBTRACTIONS,
    GET_SUBTRACTION,
    SHORTLIST_SUBTRACTIONS,
    WS_INSERT_SUBTRACTION,
    WS_REMOVE_SUBTRACTION,
    WS_UPDATE_SUBTRACTION
} from "../app/actionTypes";
import { insert, remove, update, updateDocuments } from "../utils/reducers";

export const initialState = {
    detail: null,
    documents: null,
    shortlist: null,
    page: 0,
    total_count: 0
};

export const subtractionsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_SUBTRACTION, (state, action) => {
            return insert(state, action, "id");
        })
        .addCase(WS_UPDATE_SUBTRACTION, (state, action) => {
            return update(state, action, "id");
        })
        .addCase(WS_REMOVE_SUBTRACTION, (state, action) => {
            return remove(state, action);
        })
        .addCase(FIND_SUBTRACTIONS.REQUESTED, (state, action) => {
            state.term = action.term;
        })
        .addCase(FIND_SUBTRACTIONS.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action, "id");
        })
        .addCase(SHORTLIST_SUBTRACTIONS.SUCCEEDED, (state, action) => {
            state.shortlist = action.data;
        })
        .addCase(GET_SUBTRACTION.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_SUBTRACTION.SUCCEEDED, (state, action) => {
            state.detail = action.data;
        })
        .addCase(EDIT_SUBTRACTION.SUCCEEDED, (state, action) => {
            state.detail = action.data;
        });
});

export default subtractionsReducer;
