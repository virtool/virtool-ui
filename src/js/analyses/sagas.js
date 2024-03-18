import { throttle } from "redux-saga/effects";
import { BLAST_NUVS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as analysesAPI from "./api";

export function* watchAnalyses() {
    yield throttle(150, BLAST_NUVS.REQUESTED, blastNuvs);
}

export function* blastNuvs(action) {
    yield apiCall(analysesAPI.blastNuvs, action.payload, BLAST_NUVS, {
        analysisId: action.payload.analysisId,
        sequenceIndex: action.payload.sequenceIndex,
    });
}
