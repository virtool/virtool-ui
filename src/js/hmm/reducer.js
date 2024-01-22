import { createReducer } from "@reduxjs/toolkit";
import { set } from "lodash-es";
import { FIND_HMMS, WS_UPDATE_STATUS } from "../app/actionTypes";
import { updateDocuments } from "../utils/reducers";

export const initialState = {
    term: "",
    task: null,
    documents: null,
    page: 0,
    detail: null,
};

export const hmmsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_UPDATE_STATUS, (state, action) => {
            if (action.payload.id === "hmm") {
                set(state, "status.installed", action.payload.installed);
                set(state, "status.task", action.payload.task);
                set(state, "status.release", action.payload.release);
            }
        })
        .addCase(FIND_HMMS.REQUESTED, (state, action) => {
            state.term = action.payload.term;
        })
        .addCase(FIND_HMMS.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "cluster");
        });
});

export default hmmsReducer;
