import { createAction } from "@reduxjs/toolkit";
import {
    ANALYZE,
    BLAST_NUVS,
    FIND_ANALYSES,
    GET_ANALYSIS,
    REMOVE_ANALYSIS,
    SET_ANALYSIS_ACTIVE_ID,
    SET_ANALYSIS_SORT_KEY,
    SET_AODP_FILTER,
    SET_SEARCH_IDS,
    TOGGLE_ANALYSIS_SORT_DESCENDING,
    TOGGLE_FILTER_ISOLATES,
    TOGGLE_FILTER_ORFS,
    TOGGLE_FILTER_OTUS,
    TOGGLE_FILTER_SEQUENCES,
    TOGGLE_SHOW_PATHOSCOPE_READS,
    WS_INSERT_ANALYSIS,
    WS_REMOVE_ANALYSIS,
    WS_UPDATE_ANALYSIS
} from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a analysis document is inserted via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object}
 */

export const wsInsertAnalysis = createAction(WS_INSERT_ANALYSIS);

/**
 * Returns an action that should be dispatched when a analysis document is updated via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateAnalysis = createAction(WS_UPDATE_ANALYSIS);

/**
 * Returns an action that should be dispatched when a analysis document is removed via websocket.
 *
 * @func
 * @param data {string} the id for the specific analysis
 * @returns {object}
 */
export const wsRemoveAnalysis = createAction(WS_REMOVE_ANALYSIS);

export const setActiveHitId = createAction(SET_ANALYSIS_ACTIVE_ID, id => ({
    payload: { id }
}));

export const setSearchIds = createAction(SET_SEARCH_IDS, ids => ({
    payload: { ids }
}));

export const setAODPFilter = createAction(SET_AODP_FILTER, filterMin => ({
    payload: { filterMin }
}));

export const setAnalysisSortKey = createAction(SET_ANALYSIS_SORT_KEY, sortKey => ({
    payload: { sortKey }
}));

export const toggleFilterOTUs = createAction(TOGGLE_FILTER_OTUS);
export const toggleFilterIsolates = createAction(TOGGLE_FILTER_ISOLATES);
export const toggleFilterORFs = createAction(TOGGLE_FILTER_ORFS);
export const toggleFilterSequences = createAction(TOGGLE_FILTER_SEQUENCES);
export const toggleAnalysisSortDescending = createAction(TOGGLE_ANALYSIS_SORT_DESCENDING);
export const toggleShowPathoscopeReads = createAction(TOGGLE_SHOW_PATHOSCOPE_READS);

export const findAnalyses = createAction(FIND_ANALYSES.REQUESTED, (sampleId, term, page) => ({
    payload: { sampleId, term, page }
}));

/**
 * Returns action that can trigger an API call for retrieving a specific analysis.
 *
 * @func
 * @param analysisId {string} unique analysis id
 * @returns {object}
 */
export const getAnalysis = createAction(GET_ANALYSIS.REQUESTED, analysisId => ({
    payload: { analysisId }
}));

/**
 * Returns action that can trigger an API call for sample analysis.
 *
 * @func
 * @param sampleId {string} unique sample id
 * @param refId {string} unique id for a reference
 * @param workflow {string} the workflow to run
 * @param subtractionIds {Array} string - the subtractions to use for the analysis
 * @param userId {string} the id of the requesting user
 * @returns {object}
 */
export const analyze = createAction(ANALYZE.REQUESTED, (sampleId, refId, subtractionIds, userId, workflow) => ({
    payload: {
        refId,
        sampleId,
        subtractionIds,
        userId,
        workflow
    }
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
    payload: { analysisId, sequenceIndex }
}));

/**
 * Returns action that can trigger an API call for removing an analysis.
 *
 * @func
 * @param analysisId {string} unique analysis id
 * @returns {object}
 */
export const removeAnalysis = createAction(REMOVE_ANALYSIS.REQUESTED, analysisId => ({
    payload: { analysisId }
}));
