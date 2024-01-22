import { takeLatest } from "redux-saga/effects";
import { FIND_USERS } from "../app/actionTypes";
import { apiCall, pushFindTerm } from "../utils/sagas";
import * as usersAPI from "./api";

function* findUsers(action) {
    yield apiCall(usersAPI.find, action.payload, FIND_USERS);
    yield pushFindTerm(action.payload.term);
}

export function* watchUsers() {
    yield takeLatest(FIND_USERS.REQUESTED, findUsers);
}
