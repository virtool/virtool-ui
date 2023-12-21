import { createAction } from "@reduxjs/toolkit";
import { FIND_HMMS } from "../app/actionTypes";

export const findHmms = createAction(FIND_HMMS.REQUESTED, (term, page) => ({
    payload: { term, page },
}));
