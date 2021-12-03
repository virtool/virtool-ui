import { createReducer } from "@reduxjs/toolkit";
import { get, map } from "lodash-es";
import {
    BLAST_NUVS,
    CLEAR_ANALYSES,
    CLEAR_ANALYSIS,
    FIND_ANALYSES,
    GET_ANALYSIS,
    LIST_READY_INDEXES,
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
import { insert, remove, update, updateDocuments } from "../utils/reducers";
import { formatData } from "./utils";

export const initialState = {
    activeId: null,
    documents: null,
    term: "",
    data: null,
    detail: null,
    readyIndexes: null,

    sortKey: "coverage",
    sortDescending: true,

    searchIds: null,
    sortIds: null,

    // Pathoscope-specific
    filterOTUs: true,
    filterIsolates: true,
    showPathoscopeReads: false,

    // NuVs specific,
    filterORFs: true,
    filterSequences: true,

    //AODP
    filterAODP: 0.97
};

export const getInitialSortKey = action => {
    switch (action.data.workflow) {
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
                results: map(detail.results, sequence => {
                    if (sequence.index === sequenceIndex) {
                        return { ...sequence, blast: data };
                    }

                    return sequence;
                })
            }
        };
    }

    return state;
};

export const updateIdLists = (state, action) => {
    const analysisDetailId = get(state, "detail.id", null);
    const detail = formatData(action.data);

    if (analysisDetailId === action.data.id) {
        return {
            ...state,
            detail
        };
    }

    return {
        ...state,
        activeId: null,
        filterIds: null,
        searchIds: null,
        detail,
        sortKey: getInitialSortKey(action)
    };
};

export const analysesReducer = createReducer(initialState, builder => {
    builder
        .addCase(SET_AODP_FILTER, (state, action) => {
            state.filterAODP = action.filterMin;
        })
        .addCase(WS_INSERT_ANALYSIS, (state, action) => {
            return insert(state, action, state.sortKey, state.sortDescending);
        })
        .addCase(WS_UPDATE_ANALYSIS, (state, action) => {
            return update(state, action);
        })
        .addCase(WS_REMOVE_ANALYSIS, (state, action) => {
            return remove(state, action);
        })
        .addCase(SET_ANALYSIS_ACTIVE_ID, (state, action) => {
            state.activeId = action.id;
        })
        .addCase(SET_SEARCH_IDS, (state, action) => {
            state.searchIds = action.ids;
        })
        .addCase(TOGGLE_FILTER_OTUS, state => {
            state.filterOTUs = !state.filterOTUs;
        })
        .addCase(TOGGLE_FILTER_ISOLATES, state => {
            state.filterIsolates = !state.filterIsolates;
        })
        .addCase(TOGGLE_FILTER_ORFS, state => {
            state.filterORFs = !state.filterORFs;
        })
        .addCase(TOGGLE_FILTER_SEQUENCES, state => {
            state.filterSequences = !state.filterSequences;
        })
        .addCase(TOGGLE_SHOW_PATHOSCOPE_READS, state => {
            state.showPathoscopeReads = !state.showPathoscopeReads;
        })
        .addCase(SET_ANALYSIS_SORT_KEY, (state, action) => {
            state.sortKey = action.sortKey;
        })
        .addCase(TOGGLE_ANALYSIS_SORT_DESCENDING, state => {
            state.sortDescending = !state.sortDescending;
        })
        .addCase(LIST_READY_INDEXES.SUCCEEDED, (state, action) => {
            state.readyIndexes = action.data;
        })
        .addCase(FIND_ANALYSES.REQUESTED, (state, action) => {
            state.term = action.term;
        })
        .addCase(FIND_ANALYSES.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action, "created_at", true);
        })
        .addCase(GET_ANALYSIS.REQUESTED, (state, action) => {
            if (get(state, "detail.id", null) !== action.analysisId) {
                state.activeId = null;
                state.detail = null;
                state.filterIds = null;
                state.searchIds = null;
                state.sortKey = "length";
            }
        })
        .addCase(GET_ANALYSIS.SUCCEEDED, (state, action) => {
            return updateIdLists(state, action);
        })
        .addCase(CLEAR_ANALYSES, state => {
            state.documents = null;
        })
        .addCase(CLEAR_ANALYSIS, state => {
            state.detail = null;
            state.searchIds = null;
        })
        .addCase(BLAST_NUVS.REQUESTED, (state, action) => {
            return setNuvsBLAST(state, action.analysisId, action.sequenceIndex, {
                ready: false
            });
        })
        .addCase(BLAST_NUVS.SUCCEEDED, (state, action) => {
            const { analysisId, sequenceIndex } = action.context;
            return setNuvsBLAST(state, analysisId, sequenceIndex, action.data);
        });
});

export default analysesReducer;
