import { takeEvery, takeLatest } from "redux-saga/effects";
import { GET_SETTINGS, UPDATE_SETTINGS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import { legacyFetchSettings as apiFetchSettings, updateSettings as apiUpdateSettings } from "./api";

export function* watchSettings() {
    yield takeLatest(GET_SETTINGS.REQUESTED, getSettings);
    yield takeEvery(UPDATE_SETTINGS.REQUESTED, updateSettings);
}

function* getSettings(action) {
    yield apiCall(apiFetchSettings, action, GET_SETTINGS);
}

function* updateSettings(action) {
    yield apiCall(apiUpdateSettings, action.payload, UPDATE_SETTINGS, {
        update: action.payload.update,
    });
}
