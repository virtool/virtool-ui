import { createReducer } from "@reduxjs/toolkit";
import { assign } from "lodash-es";
import { GET_SETTINGS, UPDATE_SETTINGS } from "../app/actionTypes";

export const initialState = {
    data: null
};

export const settingsReducer = createReducer(initialState, builder => {
    builder
        .addCase(GET_SETTINGS.SUCCEEDED, (state, action) => {
            state.data = action.data;
        })
        .addCase(UPDATE_SETTINGS.SUCCEEDED, (state, action) => {
            assign(state.data, action.context.update);
        });
});

export default settingsReducer;
