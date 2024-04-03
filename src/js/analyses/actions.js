import { createAction } from "@reduxjs/toolkit";
import {
    BLAST_NUVS,
    SET_ANALYSIS,
    SET_ANALYSIS_ACTIVE_ID,
    SET_ANALYSIS_SORT_KEY,
    SET_AODP_FILTER,
    SET_SEARCH_IDS,
    TOGGLE_ANALYSIS_SORT_DESCENDING,
    TOGGLE_FILTER_ORFS,
    TOGGLE_FILTER_SEQUENCES,
    WS_UPDATE_ANALYSIS,
} from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a analysis document is updated via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateAnalysis = createAction(WS_UPDATE_ANALYSIS);

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

export const toggleFilterORFs = createAction(TOGGLE_FILTER_ORFS);
export const toggleFilterSequences = createAction(TOGGLE_FILTER_SEQUENCES);
export const toggleAnalysisSortDescending = createAction(TOGGLE_ANALYSIS_SORT_DESCENDING);

/**
 * Returns action that sets the current analysis in redux state
 *
 * @func
 * @param analysisId {Analysis} A complete analysis
 * @returns {object}
 */
export const setAnalysis = createAction(SET_ANALYSIS, analysis => ({
    payload: analysis,
}));

/**
 * Returns action that can trigger an API call for BLASTing NuV analysis contigs.
 *
 * @func
 * @param analysisId {string} unique analysis id
 * @param sequenceIndex {number} index of the sequence
 * @returns {object}
 */
export const blastNuvs = createAction(BLAST_NUVS.REQUESTED, (analysisId, sequenceIndex) => ({
    payload: { analysisId, sequenceIndex },
}));
