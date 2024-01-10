import { takeLatest } from "redux-saga/effects";
import { GET_SETTINGS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import { legacyFetchSettings as apiFetchSettings } from "./api";

export function* watchSettings() {
    yield takeLatest(GET_SETTINGS.REQUESTED, getSettings);
}

function* getSettings(action) {
    yield apiCall(apiFetchSettings, action, GET_SETTINGS);
}
