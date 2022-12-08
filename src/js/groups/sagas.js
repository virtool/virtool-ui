import { push } from "connected-react-router";
import { some } from "lodash-es";
import { takeEvery, takeLatest, throttle, select, put } from "redux-saga/effects";
import {
    CREATE_GROUP,
    GET_GROUP,
    LIST_GROUPS,
    REMOVE_GROUP,
    SET_GROUP_PERMISSION,
    WS_REMOVE_GROUP,
    WS_INSERT_GROUP,
    SET_GROUP_NAME
} from "../app/actionTypes";
import { apiCall } from "../utils/sagas";
import * as groupsAPI from "./api";
import { getActiveGroup, getGroups } from "./selectors";
import { removeActiveGroup } from "./actions";

function* UpdateActiveGroup() {
    const activeGroup = yield select(getActiveGroup);
    const groups = yield select(getGroups);
    if (!activeGroup || !some(groups, { id: activeGroup.id })) {
        if (groups.length) yield getGroup({ payload: { groupId: groups[0].id } });
        else yield put(removeActiveGroup(null));
    }
}

function* listGroups(action) {
    const resp = yield apiCall(groupsAPI.list, action, LIST_GROUPS);
    if (resp.ok) {
        yield UpdateActiveGroup();
    }
}

function* getGroup(action) {
    yield apiCall(groupsAPI.get, action.payload, GET_GROUP);
}

function* createGroup(action) {
    const resp = yield apiCall(groupsAPI.create, action.payload, CREATE_GROUP);

    if (resp.ok) {
        yield put(push({ state: { createGroup: false } }));
    }
}

function* setGroupPermission(action) {
    yield apiCall(groupsAPI.setPermission, action.payload, SET_GROUP_PERMISSION);
}

function* setGroupName(action) {
    yield apiCall(groupsAPI.setName, action.payload, SET_GROUP_NAME);
}

function* removeGroup(action) {
    yield apiCall(groupsAPI.remove, action.payload, REMOVE_GROUP);
}

export function* watchGroups() {
    yield takeLatest(LIST_GROUPS.REQUESTED, listGroups);
    yield throttle(200, CREATE_GROUP.REQUESTED, createGroup);
    yield takeEvery(SET_GROUP_PERMISSION.REQUESTED, setGroupPermission);
    yield throttle(100, REMOVE_GROUP.REQUESTED, removeGroup);
    yield takeLatest(GET_GROUP.REQUESTED, getGroup);
    yield takeLatest([WS_REMOVE_GROUP, WS_INSERT_GROUP, "test"], UpdateActiveGroup);
    yield takeLatest(SET_GROUP_NAME.REQUESTED, setGroupName);
}
