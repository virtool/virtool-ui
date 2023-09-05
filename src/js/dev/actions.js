import { createAction } from "@reduxjs/toolkit";
import { POST_DEV_COMMAND } from "../app/actionTypes";

export const postDevCommand = createAction(POST_DEV_COMMAND.REQUESTED, command => ({ payload: { command } }));
