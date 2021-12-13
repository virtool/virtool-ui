import { GET_CACHE } from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";
export const getCache = createAction(GET_CACHE.REQUESTED, cacheId => ({
    payload: { cacheId }
}));
