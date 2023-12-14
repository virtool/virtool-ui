import { select, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import {
    ANALYZE,
    BLAST_NUVS,
    FIND_ANALYSES,
    GET_ANALYSIS,
    REMOVE_ANALYSIS,
    WS_UPDATE_ANALYSIS,
} from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import { findAnalyses as findAnalysesAction } from "./actions";
import * as analysesAPI from "./api";
import { getAnalysisDetailId } from "./selectors";

export function* watchAnalyses() {
    yield takeLatest(WS_UPDATE_ANALYSIS, wsUpdateAnalysis);
    yield takeLatest(FIND_ANALYSES.REQUESTED, findAnalyses);
    yield takeLatest(GET_ANALYSIS.REQUESTED, getAnalysis);
    yield takeEvery(ANALYZE.REQUESTED, analyze);
    yield throttle(150, BLAST_NUVS.REQUESTED, blastNuvs);
    yield takeLatest(REMOVE_ANALYSIS.REQUESTED, removeAnalysis);
}

export function* wsUpdateAnalysis(action) {
    const analysisId = yield select(getAnalysisDetailId);

    if (analysisId === action.payload.id) {
        yield apiCall(analysesAPI.get, { analysisId }, GET_ANALYSIS);
    }
}

export function* findAnalyses(action) {
    console.log({ action });
    yield apiCall(analysesAPI.find, action.payload, FIND_ANALYSES);
    yield pushFindTerm(action.payload.term);
}

export function* getAnalysis(action) {
    yield apiCall(analysesAPI.get, action.payload, GET_ANALYSIS);
}

export function* analyze(action) {
    const response = yield apiCall(analysesAPI.analyze, action.payload, ANALYZE);

    if (response.ok) {
        const location = yield select(state => state.router.location);
        const searchParams = new URLSearchParams(location.search);
        console.log(searchParams);

        yield findAnalyses(findAnalysesAction(action.payload.sampleId, searchParams.get("find") || null, 1));
    }
}

export function* blastNuvs(action) {
    yield apiCall(analysesAPI.blastNuvs, action.payload, BLAST_NUVS, {
        analysisId: action.payload.analysisId,
        sequenceIndex: action.payload.sequenceIndex,
    });
}

export function* removeAnalysis(action) {
    yield apiCall(analysesAPI.remove, action.payload, REMOVE_ANALYSIS);
}
