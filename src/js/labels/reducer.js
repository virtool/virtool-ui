import { createReducer } from "@reduxjs/toolkit";
import { CREATE_LABEL, LIST_LABELS, REMOVE_LABEL, UPDATE_LABEL } from "../app/actionTypes";
import { insert, remove, update } from "../utils/reducers";

export const initialState = {
    documents: null,
};

export const labelsReducer = createReducer(initialState, builder => {
    builder
        .addCase(LIST_LABELS.SUCCEEDED, (state, action) => {
            return { ...state, documents: action.payload };
        })
        .addCase(CREATE_LABEL.SUCCEEDED, (state, action) => {
            return insert(state, action.payload);
        })
        .addCase(UPDATE_LABEL.SUCCEEDED, (state, action) => {
            return update(state, action.payload);
        })
        .addCase(REMOVE_LABEL.SUCCEEDED, (state, action) => {
            return remove(state, action.payload);
        });
});

export default labelsReducer;
