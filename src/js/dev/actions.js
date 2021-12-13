import { POST_DEV_COMMAND } from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const postDevCommand = createAction(POST_DEV_COMMAND.REQUESTED, command => ({ payload: { command } }));
