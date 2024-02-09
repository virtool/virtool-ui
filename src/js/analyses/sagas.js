import { select, takeLatest, throttle } from "redux-saga/effects";
import { BLAST_NUVS, GET_ANALYSIS, WS_UPDATE_ANALYSIS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as analysesAPI from "./api";
import { getAnalysisDetailId } from "./selectors";

export function* watchAnalyses() {
    yield takeLatest(WS_UPDATE_ANALYSIS, wsUpdateAnalysis);
    yield takeLatest(GET_ANALYSIS.REQUESTED, getAnalysis);
    yield throttle(150, BLAST_NUVS.REQUESTED, blastNuvs);
}

export function* wsUpdateAnalysis(action) {
    const analysisId = yield select(getAnalysisDetailId);

    if (analysisId === action.payload.id) {
        yield apiCall(analysesAPI.get, { analysisId }, GET_ANALYSIS);
    }
}

export function* getAnalysis(action) {
    yield apiCall(analysesAPI.get, action.payload, GET_ANALYSIS);
}

export function* blastNuvs(action) {
    yield apiCall(analysesAPI.blastNuvs, action.payload, BLAST_NUVS, {
        analysisId: action.payload.analysisId,
        sequenceIndex: action.payload.sequenceIndex,
    });
}
