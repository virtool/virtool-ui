import { createReducer } from "@reduxjs/toolkit";
import {
    FIND_INDEXES,
    GET_INDEX,
    GET_INDEX_HISTORY,
    GET_UNBUILT,
    WS_INSERT_HISTORY,
    WS_INSERT_INDEX,
    WS_UPDATE_INDEX,
} from "../app/actionTypes";
import { insert, update, updateDocuments } from "../utils/reducers";

export const initialState = {
    documents: null,
    page: 0,
    modified_count: 0,
    total_otu_count: 0,
    detail: null,
    history: null,
    unbuilt: null,
    showRebuild: false,
};

export const indexesReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_HISTORY, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                state.modified_otu_count++;
            }
            return state;
        })
        .addCase(WS_INSERT_INDEX, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                return insert(state, action.payload, "version", true);
            }
            return state;
        })
        .addCase(WS_UPDATE_INDEX, (state, action) => {
            if (action.payload.reference.id === state.refId) {
                return update(state, action.payload, "version", true);
            }
            return state;
        })
        .addCase(FIND_INDEXES.REQUESTED, (state, action) => {
            if (action.payload.refId !== state.refId) {
                state.documents = null;
            }
            state.term = action.payload.term;
            state.refId = action.payload.refId;
        })
        .addCase(FIND_INDEXES.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "version", true);
        })
        .addCase(GET_INDEX.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(GET_UNBUILT.SUCCEEDED, (state, action) => {
            state.unbuilt = action.payload;
        })
        .addCase(GET_INDEX_HISTORY.SUCCEEDED, (state, action) => {
            return {
                ...state,
                history: {
                    ...updateDocuments(state.history, action.payload, "otu.name"),
                },
            };
        });
});

export default indexesReducer;
