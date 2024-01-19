import { push } from "connected-react-router";
import { put, takeLatest, throttle } from "redux-saga/effects";
import { REMOVE_SUBTRACTION, SHORTLIST_SUBTRACTIONS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as subtractionAPI from "./api";

export function* shortlistSubtractions(action) {
    yield apiCall(subtractionAPI.shortlist, action.payload, SHORTLIST_SUBTRACTIONS);
}

export function* removeSubtraction(action) {
    const resp = yield apiCall(subtractionAPI.remove, action.payload, REMOVE_SUBTRACTION);

    if (resp.ok) {
        yield put(push("/subtractions"));
    }
}

export function* watchSubtraction() {
    yield takeLatest(SHORTLIST_SUBTRACTIONS.REQUESTED, shortlistSubtractions);
    yield throttle(300, REMOVE_SUBTRACTION.REQUESTED, removeSubtraction);
}
