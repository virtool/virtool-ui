import { createReducer } from "@reduxjs/toolkit";
import { GET_SETTINGS } from "../app/actionTypes";

export const initialState = {
    data: null,
};

export const settingsReducer = createReducer(initialState, builder => {
    builder.addCase(GET_SETTINGS.SUCCEEDED, (state, action) => {
        state.data = action.payload;
    });
});

export default settingsReducer;
