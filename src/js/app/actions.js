import { PUSH_STATE, SET_INITIAL_STATE } from "./actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const pushState = createAction(PUSH_STATE, state => ({
    payload: { state }
}));

export const setInitialState = createAction(SET_INITIAL_STATE, ({ dev, first_user }) => ({
    payload: { dev, first: first_user }
}));
