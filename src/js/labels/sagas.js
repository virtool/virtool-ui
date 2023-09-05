import { put, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import { pushState } from "../app/actions";
import { CREATE_LABEL, LIST_LABELS, REMOVE_LABEL, UPDATE_LABEL } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import { listLabels as listLabelsAction } from "./actions";
import * as labelsAPI from "./api";

export function* watchLabels() {
    yield takeLatest(LIST_LABELS.REQUESTED, listLabels);
    yield throttle(500, CREATE_LABEL.REQUESTED, createLabel);
    yield throttle(300, REMOVE_LABEL.REQUESTED, removeLabel);
    yield takeEvery(UPDATE_LABEL.REQUESTED, updateLabel);
}

export function* listLabels(action) {
    yield apiCall(labelsAPI.listLabels, action.payload, LIST_LABELS);
}

export function* createLabel(action) {
    const { ok } = yield apiCall(labelsAPI.create, action.payload, CREATE_LABEL);

    if (ok) {
        yield put(pushState({ createLabel: false }));
    }
}

export function* removeLabel(action) {
    const { ok } = yield apiCall(labelsAPI.remove, action.payload, REMOVE_LABEL);

    if (ok) {
        yield put(pushState({ removeLabel: false }));
        yield put(listLabelsAction());
    }
}

export function* updateLabel(action) {
    const { ok } = yield apiCall(labelsAPI.update, action.payload, UPDATE_LABEL);

    if (ok) {
        yield put(pushState({ updateLabel: false }));
    }
}
