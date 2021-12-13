import { push } from "connected-react-router";
import { all, put, select, takeEvery, takeLatest, throttle } from "redux-saga/effects";
import { pushState } from "../app/actions";
import {
    ADD_ISOLATE,
    ADD_SEQUENCE,
    CREATE_OTU,
    EDIT_ISOLATE,
    EDIT_OTU,
    EDIT_SEQUENCE,
    FIND_OTUS,
    GET_OTU,
    GET_OTU_HISTORY,
    REMOVE_ISOLATE,
    REMOVE_OTU,
    REMOVE_SEQUENCE,
    REVERT,
    SET_ISOLATE_AS_DEFAULT
} from "../app/actionTypes";
import { apiCall, pushFindTerm, putGenericError } from "../utils/sagas";
import * as otusAPI from "./api";
import { createAction } from "@reduxjs/toolkit";
const getCurrentOTUsPath = state => `/refs/${state.references.detail.id}/otus`;
import { revertFailed, revertSucceeded } from "./actions";

export function* updateAndGetOTU(apiMethod, action, actionType) {
    let response;

    try {
        response = yield apiMethod(action.payload);
    } catch (err) {
        yield putGenericError(actionType, err);
        response = err.response;
    }

    const getResponse = yield otusAPI.get(action.payload);
    const curAction = createAction(actionType.SUCCEEDED);
    yield put(curAction(getResponse.body));

    return response;
}

export function* findOTUs(action) {
    yield apiCall(otusAPI.find, action.payload, FIND_OTUS);
    yield pushFindTerm(action.payload.term);
}

export function* getOTU(action) {
    yield apiCall(otusAPI.get, action.payload, GET_OTU);
}

export function* getOTUHistory(action) {
    yield apiCall(otusAPI.getHistory, action.payload, GET_OTU_HISTORY);
}

export function* createOTU(action) {
    const resp = yield apiCall(otusAPI.create, action.payload, CREATE_OTU);

    if (resp.ok) {
        yield put(push({ state: { createOTU: false } }));
    }
}

export function* editOTU(action) {
    yield apiCall(otusAPI.edit, action.payload, EDIT_OTU);
}

export function* setIsolateAsDefault(action) {
    yield updateAndGetOTU(otusAPI.setIsolateAsDefault, action, SET_ISOLATE_AS_DEFAULT);
}

export function* removeOTU(action) {
    const resp = yield apiCall(otusAPI.remove, action.payload, REMOVE_OTU);

    if (resp.ok) {
        yield put(push(`/refs/${action.payload.refId}/otus`));
    }
}

export function* addIsolate(action) {
    yield updateAndGetOTU(otusAPI.addIsolate, action, ADD_ISOLATE);
}

export function* editIsolate(action) {
    yield updateAndGetOTU(otusAPI.editIsolate, action, EDIT_ISOLATE);
}

export function* removeIsolate(action) {
    yield updateAndGetOTU(otusAPI.removeIsolate, action, REMOVE_ISOLATE);
}

export function* addSequence(action) {
    const response = yield updateAndGetOTU(otusAPI.addSequence, action, ADD_SEQUENCE);

    if (response.ok) {
        yield put(pushState({ addSequence: false }));
    }
}

export function* editSequence(action) {
    const response = yield updateAndGetOTU(otusAPI.editSequence, action, EDIT_SEQUENCE);

    if (response.ok) {
        yield put(pushState({ editSequence: false }));
    }
}

export function* removeSequence(action) {
    yield updateAndGetOTU(otusAPI.removeSequence, action, REMOVE_SEQUENCE);
}

export function* revert(action) {
    try {
        yield otusAPI.revert(action.payload);

        if (action.payload.otuVersion === 0) {
            const path = yield select(getCurrentOTUsPath);
            yield put(push(path));
        } else {
            const [otuResponse, historyResponse] = yield all([
                otusAPI.get(action.payload),
                otusAPI.getHistory(action.payload)
            ]);
            yield put(revertSucceeded(otuResponse.body, historyResponse.body));
        }
    } catch (error) {
        yield put(revertFailed(error));
    }
}

export function* watchOTUs() {
    yield throttle(500, FIND_OTUS.REQUESTED, findOTUs);
    yield takeLatest(GET_OTU.REQUESTED, getOTU);
    yield takeLatest(GET_OTU_HISTORY.REQUESTED, getOTUHistory);
    yield takeEvery(CREATE_OTU.REQUESTED, createOTU);
    yield takeEvery(EDIT_OTU.REQUESTED, editOTU);
    yield takeEvery(REMOVE_OTU.REQUESTED, removeOTU);
    yield takeEvery(ADD_ISOLATE.REQUESTED, addIsolate);
    yield takeEvery(EDIT_ISOLATE.REQUESTED, editIsolate);
    yield takeEvery(SET_ISOLATE_AS_DEFAULT.REQUESTED, setIsolateAsDefault);
    yield takeEvery(REMOVE_ISOLATE.REQUESTED, removeIsolate);
    yield takeEvery(ADD_SEQUENCE.REQUESTED, addSequence);
    yield takeEvery(EDIT_SEQUENCE.REQUESTED, editSequence);
    yield takeEvery(REMOVE_SEQUENCE.REQUESTED, removeSequence);
    yield takeEvery(REVERT.REQUESTED, revert);
}
