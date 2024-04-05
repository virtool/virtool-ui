import { takeLatest } from "redux-saga/effects";
import { LIST_LABELS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as labelsAPI from "./api";

export function* watchLabels() {
    yield takeLatest(LIST_LABELS.REQUESTED, listLabels);
}

export function* listLabels(action) {
    yield apiCall(labelsAPI.listLabels, action.payload, LIST_LABELS);
}
