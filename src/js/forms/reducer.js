import { createReducer } from "@reduxjs/toolkit";
import { SET_REDUX_FORM_STATE } from "../app/actionTypes";
import { getSessionStorage } from "../utils/utils";

const initialState = () => ({
    formState: getSessionStorage("formState") || {},
});

export const formsReducer = createReducer(initialState, builder => {
    builder.addCase(SET_REDUX_FORM_STATE, (state, action) => {
        const { formState } = action.payload;
        state.formState = formState;
    });
});
