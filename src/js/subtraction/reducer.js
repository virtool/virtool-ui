import { createReducer } from "@reduxjs/toolkit";
import { SHORTLIST_SUBTRACTIONS, WS_REMOVE_SUBTRACTION, WS_UPDATE_JOB } from "../app/actionTypes";
import { remove, updateJobs } from "../utils/reducers";

export const initialState = {
    detail: null,
    documents: null,
    shortlist: null,
    page: 0,
    total_count: 0,
};

export const subtractionsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_REMOVE_SUBTRACTION, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(WS_UPDATE_JOB, (state, action) => {
            return updateJobs(state, action.payload);
        })
        .addCase(SHORTLIST_SUBTRACTIONS.SUCCEEDED, (state, action) => {
            state.shortlist = action.payload;
        });
});

export default subtractionsReducer;
