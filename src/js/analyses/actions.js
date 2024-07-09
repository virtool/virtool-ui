import { createAction } from "@reduxjs/toolkit";
import { SET_ANALYSIS_ACTIVE_ID, SET_ANALYSIS_SORT_KEY, SET_AODP_FILTER, SET_SEARCH_IDS } from "../app/actionTypes";

export const setActiveHitId = createAction(SET_ANALYSIS_ACTIVE_ID, id => ({
    payload: { id },
}));

export const setSearchIds = createAction(SET_SEARCH_IDS, ids => ({
    payload: { ids },
}));

export const setAODPFilter = createAction(SET_AODP_FILTER, filterMin => ({
    payload: { filterMin },
}));

export const setAnalysisSortKey = createAction(SET_ANALYSIS_SORT_KEY, sortKey => ({
    payload: { sortKey },
}));
