import { createReducer } from "@reduxjs/toolkit";
import { SET_ANALYSIS_ACTIVE_ID, SET_ANALYSIS_SORT_KEY, SET_AODP_FILTER, SET_SEARCH_IDS } from "../app/actionTypes";

export const initialState = {
    activeId: null,
    documents: null,
    detail: null,
    filterAODP: 0.97,
    filterIsolates: true,
    filterORFs: true,
    filterOTUs: true,
    filterSequences: true,
    readyIndexes: null,
    sampleId: null,
    searchIds: null,
    showPathoscopeReads: false,
    sortKey: "coverage",
    sortDescending: true,
    sortIds: null,
    term: "",
};

export const analysesReducer = createReducer(initialState, builder => {
    builder
        .addCase(SET_ANALYSIS_ACTIVE_ID, (state, action) => {
            state.activeId = action.payload.id;
        })
        .addCase(SET_ANALYSIS_SORT_KEY, (state, action) => {
            state.sortKey = action.payload.sortKey;
        })
        .addCase(SET_AODP_FILTER, (state, action) => {
            state.filterAODP = action.payload.filterMin;
        })
        .addCase(SET_SEARCH_IDS, (state, action) => {
            state.searchIds = action.payload.ids;
        });
});

export default analysesReducer;
