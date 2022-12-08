import { takeEvery, takeLatest } from "redux-saga/effects";
import { GET_INSTANCE_MESSAGE, SET_INSTANCE_MESSAGE } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as instanceMessageApi from "./api";

function* getInstanceMessage(action) {
    yield apiCall(instanceMessageApi.get, action, GET_INSTANCE_MESSAGE);
}

function* setInstanceMessage(action) {
    yield apiCall(instanceMessageApi.set, action.payload, SET_INSTANCE_MESSAGE, {
        message: action.payload.message
    });
}

export function* watchInstanceMessage() {
    yield takeLatest(GET_INSTANCE_MESSAGE.REQUESTED, getInstanceMessage);
    yield takeEvery(SET_INSTANCE_MESSAGE.REQUESTED, setInstanceMessage);
}
