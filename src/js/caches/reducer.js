import { createReducer } from "@reduxjs/toolkit";
import { GET_CACHE } from "../app/actionTypes";

const initialState = {
    detail: null
};

export const cacheReducer = createReducer(initialState, builder => {
    builder
        .addCase(GET_CACHE.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_CACHE.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        });
});
export default cacheReducer;
