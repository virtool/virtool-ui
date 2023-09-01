/**
 * Sagas configuration and functions for connecting the HMM API to redux.
 *
 * @module hmm/sagas
 */

import { getLocation } from "connected-react-router";
import { select, takeLatest, throttle } from "redux-saga/effects";
import { FIND_HMMS, GET_HMM, INSTALL_HMMS } from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import * as hmmsApi from "./api";

export function* watchHmms() {
    yield throttle(300, FIND_HMMS.REQUESTED, findHmms);
    yield takeLatest(GET_HMM.REQUESTED, getHmm);
    yield throttle(500, INSTALL_HMMS.REQUESTED, installHmms);
}

function* findHmms(action) {
    yield apiCall(hmmsApi.find, action.payload, FIND_HMMS);

    const routerLocation = yield select(getLocation);

    if (routerLocation.pathname.startsWith("/hmm")) {
        yield pushFindTerm(action.term);
    }
}

function* installHmms(action) {
    const resp = yield apiCall(installHmms, action, INSTALL_HMMS);

    if (resp.ok) {
        yield apiCall(hmmsApi.install, {}, FIND_HMMS);
    }
}

function* getHmm(action) {
    yield apiCall(hmmsApi.fetch, action.payload, GET_HMM);
}
