import { createReducer } from "@reduxjs/toolkit";
import { LIST_LABELS } from "../app/actionTypes";

export const initialState = {
    documents: null,
};

export const labelsReducer = createReducer(initialState, builder => {
    builder.addCase(LIST_LABELS.SUCCEEDED, (state, action) => {
        return { ...state, documents: action.payload };
    });
});

export default labelsReducer;
