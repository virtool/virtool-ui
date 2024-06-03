import { createReducer } from "@reduxjs/toolkit";
import {
    SET_ANALYSIS,
    SET_ANALYSIS_ACTIVE_ID,
    SET_ANALYSIS_SORT_KEY,
    SET_AODP_FILTER,
    SET_SEARCH_IDS,
    WS_UPDATE_ANALYSIS,
} from "../app/actionTypes";
import { update } from "../utils/reducers";

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

export const getInitialSortKey = action => {
    switch (action.payload.workflow) {
        case "nuvs":
            return "length";

        case "aodp":
            return "identity";

        default:
            return "coverage";
    }
};

export const setNuvsBLAST = (state, analysisId, sequenceIndex, data = "ip") => {
    const detail = state.detail;

    if (detail && detail.id === analysisId) {
        return {
            ...state,
            detail: {
                ...detail,
                results: {
                    ...detail.results,
                    hits: detail.results.hits.map(sequence => {
                        if (sequence.index === sequenceIndex) {
                            return { ...sequence, blast: data };
                        }

                        return sequence;
                    }),
                },
            },
        };
    }

    return state;
};

export const analysesReducer = createReducer(initialState, builder => {
    builder
        .addCase(SET_ANALYSIS, (state, action) => {
            return {
                ...state,
                activeId: null,
                detail: action.payload,
                filterIds: null,
                searchIds: null,
                sortKey: getInitialSortKey(action),
            };
        })
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
        })
        .addCase(WS_UPDATE_ANALYSIS, (state, action) => {
            return update(state, action.payload);
        });
});

export default analysesReducer;
