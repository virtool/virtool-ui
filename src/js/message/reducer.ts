import { createReducer } from "@reduxjs/toolkit";
import { GET_INSTANCE_MESSAGE, SET_INSTANCE_MESSAGE } from "../app/actionTypes";

export const initialState = {
    color: null,
    loaded: false,
    message: null
};

export const instanceMessageReducer = createReducer(initialState, builder => {
    builder
        .addCase(GET_INSTANCE_MESSAGE.SUCCEEDED, (state, action) => {
            state.loaded = true;
            state.message = action.payload === null ? null : action.payload.message;
            state.color = action.payload === null ? null : action.payload.color;
        })
        .addCase(SET_INSTANCE_MESSAGE.SUCCEEDED, (state, action) => {
            state.loaded = true;

            if (action.payload == null) {
                state.color = null;
                state.message = null;
            } else {
                state.color = action.payload.color;
                state.message = action.payload.message;
            }
        });
});
