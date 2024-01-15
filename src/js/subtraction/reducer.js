import { createReducer } from "@reduxjs/toolkit";
import { SHORTLIST_SUBTRACTIONS } from "../app/actionTypes";

export const initialState = {
    detail: null,
    documents: null,
    shortlist: null,
    page: 0,
    total_count: 0,
};

export const subtractionsReducer = createReducer(initialState, builder => {
    builder.addCase(SHORTLIST_SUBTRACTIONS.SUCCEEDED, (state, action) => {
        state.shortlist = action.payload;
    });
});

export default subtractionsReducer;
