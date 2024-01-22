/**
 * Sagas configuration and functions for connecting the HMM API to redux.
 *
 * @module hmm/sagas
 */

import { getLocation } from "connected-react-router";
import { select, throttle } from "redux-saga/effects";
import { FIND_HMMS } from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import * as hmmsApi from "./api";

export function* watchHmms() {
    yield throttle(300, FIND_HMMS.REQUESTED, findHmms);
}

function* findHmms(action) {
    yield apiCall(hmmsApi.find, action.payload, FIND_HMMS);

    const routerLocation = yield select(getLocation);

    if (routerLocation.pathname.startsWith("/hmm")) {
        yield pushFindTerm(action.term);
    }
}
