import { createReducer } from "@reduxjs/toolkit";
import {
    BLAST_NUVS,
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
    WS_UPDATE_ANALYSIS,
} from "../app/actionTypes";
import { update } from "../utils/reducers";
import { formatData } from "./utils";

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
        .addCase(BLAST_NUVS.REQUESTED, (state, action) => {
            return setNuvsBLAST(state, action.payload.analysisId, action.payload.sequenceIndex, {
                ready: false,
            });
        })
        .addCase(BLAST_NUVS.SUCCEEDED, (state, action) => {
            const { analysisId, sequenceIndex } = action.context;
            return setNuvsBLAST(state, analysisId, sequenceIndex, action.payload);
        })
        .addCase(GET_ANALYSIS.SUCCEEDED, (state, action) => {
            return {
                ...state,
                activeId: null,
                detail: action.payload.ready ? formatData(action.payload) : action.payload,
                filterIds: null,
                searchIds: null,
                sortKey: getInitialSortKey(action),
            };
        })
        .addCase(LIST_READY_INDEXES.SUCCEEDED, (state, action) => {
            state.readyIndexes = action.payload;
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
        .addCase(TOGGLE_ANALYSIS_SORT_DESCENDING, state => {
            state.sortDescending = !state.sortDescending;
        })
        .addCase(WS_UPDATE_ANALYSIS, (state, action) => {
            return update(state, action.payload);
        });
});

export default analysesReducer;
