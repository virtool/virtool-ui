import { EDIT_REFERENCE, GET_REFERENCE, REMOTE_REFERENCE, WS_UPDATE_REFERENCE } from "@app/actionTypes";
import { apiCall } from "@utils/sagas";
import { push } from "connected-react-router";
import { put, select, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import * as referenceAPI from "./api";
import { getReferenceDetailId } from "./selectors";

export function* afterReferenceCreation() {
    yield put(
        push({
            pathname: "/refs",
            state: {
                cloneReference: false,
                emptyReference: false,
                importReference: false,
            },
        }),
    );
}

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

export function* remoteReference() {
    const resp = yield apiCall(
        referenceAPI.remoteReference,
        { remote_from: "virtool/ref-plant-viruses" },
        REMOTE_REFERENCE,
    );

    if (resp.ok) {
        yield afterReferenceCreation();
    }
}

export function* watchReferences() {
    yield throttle(500, REMOTE_REFERENCE.REQUESTED, remoteReference);
    yield takeEvery(EDIT_REFERENCE.REQUESTED, editReference);
    yield takeLatest(GET_REFERENCE.REQUESTED, getReference);
    yield takeLatest(WS_UPDATE_REFERENCE, wsGetReference);
}
