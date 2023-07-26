import { createAction } from "@reduxjs/toolkit";
import { GET_CACHE } from "../app/actionTypes";
export const getCache = createAction(GET_CACHE.REQUESTED, cacheId => ({
    payload: { cacheId },
}));
