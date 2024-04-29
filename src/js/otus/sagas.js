import { pushState } from "@app/actions";
import { deletePersistentFormState } from "@forms/actions";
import { createAction } from "@reduxjs/toolkit";
import { apiCall, putGenericError } from "@utils/sagas";
import { push } from "connected-react-router";
import { all, put, select, takeEvery, takeLatest } from "redux-saga/effects";
import { EDIT_SEQUENCE, GET_OTU, GET_OTU_HISTORY, REVERT } from "../app/actionTypes";
import { revertFailed, revertSucceeded } from "./actions";
import * as otusAPI from "./api";
const getCurrentOTUsPath = state => `/refs/${state.references.detail.id}/otus`;

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

export function* getOTU(action) {
    yield apiCall(otusAPI.get, action.payload, GET_OTU);
}

export function* getOTUHistory(action) {
    yield apiCall(otusAPI.getHistory, action.payload, GET_OTU_HISTORY);
}

export function* editSequence(action) {
    const response = yield updateAndGetOTU(otusAPI.editSequence, action, EDIT_SEQUENCE);

    if (response.ok) {
        yield put(pushState({ editSequence: false }));
        const sequenceData = JSON.parse(response.text);
        yield put(deletePersistentFormState(`editGenomeSequenceForm${sequenceData.id}`));
    }
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
                otusAPI.getHistory(action.payload),
            ]);
            yield put(revertSucceeded(otuResponse.body, historyResponse.body));
        }
    } catch (error) {
        yield put(revertFailed(error));
    }
}

export function* watchOTUs() {
    yield takeLatest(GET_OTU.REQUESTED, getOTU);
    yield takeLatest(GET_OTU_HISTORY.REQUESTED, getOTUHistory);
    yield takeEvery(EDIT_SEQUENCE.REQUESTED, editSequence);
    yield takeEvery(REVERT.REQUESTED, revert);
}
