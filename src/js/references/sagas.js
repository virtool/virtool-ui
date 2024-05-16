import { EDIT_REFERENCE, GET_REFERENCE, WS_UPDATE_REFERENCE } from "@app/actionTypes";
import { apiCall } from "@utils/sagas";
import { select, takeEvery, takeLatest } from "redux-saga/effects";
import * as referenceAPI from "./api";
import { getReferenceDetailId } from "./selectors";

export function* wsGetReference(action) {
    const refId = yield select(getReferenceDetailId);

    if (action.payload.id === refId) {
        yield apiCall(referenceAPI.get, { refId }, GET_REFERENCE);
    }
}

export function* getReference(action) {
    yield apiCall(referenceAPI.get, action.payload, GET_REFERENCE);
}

export function* editReference(action) {
    yield apiCall(referenceAPI.edit, action.payload, EDIT_REFERENCE);
}

export function* watchReferences() {
    yield takeEvery(EDIT_REFERENCE.REQUESTED, editReference);
    yield takeLatest(GET_REFERENCE.REQUESTED, getReference);
    yield takeLatest(WS_UPDATE_REFERENCE, wsGetReference);
}
