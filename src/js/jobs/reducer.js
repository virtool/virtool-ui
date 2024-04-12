import { createReducer } from "@reduxjs/toolkit";
import { assign } from "lodash-es";
import { ARCHIVE_JOB, GET_JOB, GET_LINKED_JOB } from "../app/actionTypes";
import { remove } from "../utils/reducers";

export const initialState = {
    documents: null,
    term: "",
    total_count: 0,
    detail: null,
    filter: "",
    fetched: false,
    linkedJobs: {},
    counts: {},
};

export const jobsReducer = createReducer(initialState, builder => {
    builder
        .addCase(GET_LINKED_JOB.SUCCEEDED, (state, action) => {
            assign(state.linkedJobs, { [action.payload.id]: action.payload });
        })
        .addCase(GET_JOB.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_JOB.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(ARCHIVE_JOB.SUCCEEDED, (state, action) => {
            return remove(state, action.payload);
        });
});

export default jobsReducer;
