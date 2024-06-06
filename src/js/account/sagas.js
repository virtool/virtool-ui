import { GET_ACCOUNT, LOGIN, RESET_PASSWORD } from "@app/actionTypes";
import { apiCall } from "@utils/sagas";
import { takeLatest } from "redux-saga/effects";
import * as accountAPI from "./api";

export function* watchAccount() {
    yield takeLatest(GET_ACCOUNT.REQUESTED, getAccount);
    yield takeLatest(LOGIN.REQUESTED, login);
    yield takeLatest(RESET_PASSWORD.REQUESTED, resetPassword);
}

export function* getAccount() {
    yield apiCall(accountAPI.get, {}, GET_ACCOUNT);
}

export function* login(action) {
    yield apiCall(accountAPI.login, action.payload, LOGIN);
}

export function* resetPassword(action) {
    yield apiCall(accountAPI.resetPassword, action.payload, RESET_PASSWORD);
}
