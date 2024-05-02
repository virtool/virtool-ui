import { get } from "lodash-es";
import { all, select, takeLatest } from "redux-saga/effects";
import {
    FIND_INDEXES,
    GET_INDEX,
    GET_INDEX_HISTORY,
    GET_REFERENCE,
    LIST_READY_INDEXES,
    REFRESH_OTUS,
    WS_UPDATE_INDEX,
} from "../app/actionTypes";
import * as otusAPI from "../otus/api";
import * as refsAPI from "../references/api";
import { apiCall } from "../utils/sagas";
import * as indexesAPI from "./api";

export function* watchIndexes() {
    yield takeLatest(WS_UPDATE_INDEX, wsChangeIndexes);
    yield takeLatest(GET_INDEX.REQUESTED, getIndex);
    yield takeLatest(GET_INDEX_HISTORY.REQUESTED, getIndexHistory);
    yield takeLatest(LIST_READY_INDEXES.REQUESTED, listReadyIndexes);
}

export function* wsChangeIndexes(action) {
    // The id of the ref associated with the WS update.
    const indexDetailId = action.payload.reference.id;

    // The id of the current detailed ref.
    const refId = yield select(state => get(state, "references.detail.id"));

    // Only update ref and indexes if refIds match.
    if (indexDetailId === refId) {
        yield all([
            apiCall(refsAPI.get, { refId }, GET_REFERENCE),
            apiCall(indexesAPI.find, { refId }, FIND_INDEXES),
            apiCall(otusAPI.find, { refId }, REFRESH_OTUS),
        ]);
    }
}

export function* getIndex(action) {
    yield select();
    yield apiCall(indexesAPI.get, action.payload, GET_INDEX);
}

export function* listReadyIndexes(action) {
    yield apiCall(indexesAPI.listReady, action.payload, LIST_READY_INDEXES);
}

export function* getIndexHistory(action) {
    yield apiCall(indexesAPI.getHistory, action.payload, GET_INDEX_HISTORY);
}
