import { pushState } from "@app/actions";
import { ADD_SEQUENCE, EDIT_SEQUENCE, GET_OTU } from "@app/actionTypes";
import { deletePersistentFormState } from "@forms/actions";
import { createAction } from "@reduxjs/toolkit";
import { apiCall, putGenericError } from "@utils/sagas";
import { put, takeEvery, takeLatest } from "redux-saga/effects";
import * as otusAPI from "./api";

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

export function* addSequence(action) {
    const response = yield updateAndGetOTU(otusAPI.addSequence, action, ADD_SEQUENCE);

    if (response.ok) {
        yield put(pushState({ addSequence: false }));
        yield put(deletePersistentFormState("addGenomeSequenceForm"));
    }
}

export function* editSequence(action) {
    const response = yield updateAndGetOTU(otusAPI.editSequence, action, EDIT_SEQUENCE);

    if (response.ok) {
        yield put(pushState({ editSequence: false }));
        const sequenceData = JSON.parse(response.text);
        yield put(deletePersistentFormState(`editGenomeSequenceForm${sequenceData.id}`));
    }
}

export function* watchOTUs() {
    yield takeLatest(GET_OTU.REQUESTED, getOTU);
    yield takeEvery(ADD_SEQUENCE.REQUESTED, addSequence);
    yield takeEvery(EDIT_SEQUENCE.REQUESTED, editSequence);
}
