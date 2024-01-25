import { takeLatest } from "redux-saga/effects";
import { SHORTLIST_SUBTRACTIONS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as subtractionAPI from "./api";

export function* shortlistSubtractions(action) {
    yield apiCall(subtractionAPI.shortlist, action.payload, SHORTLIST_SUBTRACTIONS);
}

export function* watchSubtraction() {
    yield takeLatest(SHORTLIST_SUBTRACTIONS.REQUESTED, shortlistSubtractions);
}
