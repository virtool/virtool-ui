import { createReducer } from "@reduxjs/toolkit";
import { set } from "lodash-es";
import { FIND_HMMS, GET_HMM, WS_UPDATE_STATUS } from "../app/actionTypes";
import { updateDocuments } from "../utils/reducers";

export const initialState = {
    term: "",
    task: null,
    documents: null,
    page: 0,
    detail: null
};

export const hmmsReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_UPDATE_STATUS, (state, action) => {
            if (action.data.id === "hmm") {
                set(state, "status.installed", action.data.installed);
                set(state, "status.task", action.data.task);
                set(state, "status.release", action.data.release);
            }
        })
        .addCase(FIND_HMMS.REQUESTED, (state, action) => {
            state.term = action.term;
        })
        .addCase(FIND_HMMS.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action, "cluster");
        })
        .addCase(GET_HMM.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_HMM.SUCCEEDED, (state, action) => {
            state.detail = action.data;
        });
});

export default hmmsReducer;
