import { createAction } from "@reduxjs/toolkit";
import { GET_INSTANCE_MESSAGE, SET_INSTANCE_MESSAGE, UPDATE_INSTANCE_MESSAGE } from "../app/actionTypes";

export const getInstanceMessage = createAction(GET_INSTANCE_MESSAGE.REQUESTED);
export const setInstanceMessage = createAction(SET_INSTANCE_MESSAGE.REQUESTED, message => ({
    payload: { message },
}));
export const updateInstanceMessage = createAction(UPDATE_INSTANCE_MESSAGE.REQUESTED);
