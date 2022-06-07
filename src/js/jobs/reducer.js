import { createReducer } from "@reduxjs/toolkit";
import { assign } from "lodash-es";
import {
    ARCHIVE_JOB,
    FIND_JOBS,
    GET_JOB,
    GET_LINKED_JOB,
    WS_INSERT_JOB,
    WS_REMOVE_JOB,
    WS_UPDATE_JOB
} from "../app/actionTypes";
import { insert, remove, update, updateDocuments } from "../utils/reducers";

export const initialState = {
    documents: null,
    term: "",
    page: 0,
    total_count: 0,
    detail: null,
    filter: "",
    fetched: false,
    linkedJobs: {},
    counts: {}
};

export const jobsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_JOB, (state, action) => {
            return insert(state, action.payload, "created_at");
        })
        .addCase(WS_UPDATE_JOB, (state, action) => {
            return update(state, action.payload, "created_at");
        })
        .addCase(WS_REMOVE_JOB, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(GET_LINKED_JOB.SUCCEEDED, (state, action) => {
            assign(state.linkedJobs, { [action.payload.id]: action.payload });
        })
        .addCase(FIND_JOBS.REQUESTED, (state, action) => {
            state.term = action.payload.term;
        })
        .addCase(FIND_JOBS.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "created_at");
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
