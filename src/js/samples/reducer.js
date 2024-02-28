import { createReducer } from "@reduxjs/toolkit";
import { set, xor } from "lodash-es";
import {
    CLEAR_SAMPLE_SELECTION,
    DESELECT_SAMPLES,
    FIND_SAMPLES,
    GET_SAMPLE,
    REMOVE_SAMPLE,
    SELECT_SAMPLE,
    UPDATE_SAMPLE,
    WS_INSERT_SAMPLE,
    WS_REMOVE_SAMPLE,
    WS_UPDATE_SAMPLE,
} from "../app/actionTypes";
import { insert, remove, update, updateDocuments } from "../utils/reducers";

export const initialState = {
    documents: null,
    page: 0,
    detail: null,
    readFiles: null,
    editError: false,
    selected: [],
    pathoscopeCondition: [true, false, "ip"],
    nuvsCondition: [true, false, "ip"],
};

export const samplesReducer = createReducer(initialState, builder => {
    builder
        .addCase(WS_INSERT_SAMPLE, (state, action) => {
            return insert(state, action.payload, "created_at", true);
        })
        .addCase(WS_UPDATE_SAMPLE, (state, action) => {
            return update(state, action.payload, "created_at", true);
        })
        .addCase(WS_REMOVE_SAMPLE, (state, action) => {
            return remove(state, action.payload);
        })
        .addCase(FIND_SAMPLES.REQUESTED, (state, action) => {
            const { term, pathoscope, nuvs } = action.payload;
            state.term = term;
            state.pathoscopeCondition = pathoscope;
            state.nuvsCondition = nuvs;
        })
        .addCase(FIND_SAMPLES.SUCCEEDED, (state, action) => {
            return updateDocuments(state, action.payload, "created_at", true);
        })
        .addCase(GET_SAMPLE.REQUESTED, state => {
            state.detail = null;
        })
        .addCase(GET_SAMPLE.SUCCEEDED, (state, action) => {
            state.detail = action.payload;
        })
        .addCase(UPDATE_SAMPLE.SUCCEEDED, (state, action) => {
            set(state, "detail", action.payload);
        })
        .addCase(REMOVE_SAMPLE.SUCCEEDED, state => {
            state.detail = null;
        })
        .addCase(SELECT_SAMPLE, (state, action) => {
            state.selected = xor(state.selected, [action.payload.sampleId]);
        })
        .addCase(DESELECT_SAMPLES, (state, action) => {
            state.selected = xor(state.selected, action.payload.sampleIds);
        })
        .addCase(CLEAR_SAMPLE_SELECTION, state => {
            state.selected = [];
        });
});

export default samplesReducer;
