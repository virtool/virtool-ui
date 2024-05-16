import { GET_REFERENCE } from "@app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const getReference = createAction(GET_REFERENCE.REQUESTED, refId => ({ payload: { refId } }));
