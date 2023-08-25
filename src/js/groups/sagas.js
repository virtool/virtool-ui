import { takeLatest } from "redux-saga/effects";
import { LIST_GROUPS } from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as groupsAPI from "./api";

function* listGroups(action) {
    yield apiCall(groupsAPI.list, action, LIST_GROUPS);
}

export function* watchGroups() {
    yield takeLatest(LIST_GROUPS.REQUESTED, listGroups);
}
