import {
    WS_INSERT_REFERENCE,
    WS_UPDATE_REFERENCE,
    WS_REMOVE_REFERENCE,
    FIND_REFERENCES,
    GET_REFERENCE,
    EMPTY_REFERENCE,
    EDIT_REFERENCE,
    REMOVE_REFERENCE,
    IMPORT_REFERENCE,
    CLONE_REFERENCE,
    REMOTE_REFERENCE,
    ADD_REFERENCE_USER,
    EDIT_REFERENCE_USER,
    REMOVE_REFERENCE_USER,
    ADD_REFERENCE_GROUP,
    EDIT_REFERENCE_GROUP,
    REMOVE_REFERENCE_GROUP,
    CHECK_REMOTE_UPDATES,
    UPDATE_REMOTE_REFERENCE
} from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";
/**
 * Returns an action that should be dispatched when a reference is inserted via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsInsertReference = createAction(WS_INSERT_REFERENCE);
/**
 * Returns an action that should be dispatched when a reference is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateReference = createAction(WS_UPDATE_REFERENCE);
/**
 * Returns an action that should be dispatched when a reference is removed via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsRemoveReference = createAction(WS_REMOVE_REFERENCE);

export const findReferences = createAction(FIND_REFERENCES.REQUESTED, (term, page = 1) => ({
    payload: { term, page }
}));

export const getReference = createAction(GET_REFERENCE.REQUESTED, refId => ({ payload: { refId } }));

export const emptyReference = createAction(EMPTY_REFERENCE.REQUESTED, (name, description, dataType, organism) => ({
    payload: {
        name,
        description,
        dataType,
        organism
    }
}));

export const editReference = createAction(EDIT_REFERENCE.REQUESTED, (refId, update) => ({
    payload: { refId, update }
}));

export const importReference = createAction(IMPORT_REFERENCE.REQUESTED, (name, description, fileId) => ({
    payload: {
        name,
        description,
        fileId
    }
}));

export const cloneReference = createAction(CLONE_REFERENCE.REQUESTED, (name, description, refId) => ({
    payload: {
        name,
        description,
        refId
    }
}));

export const remoteReference = createAction(REMOTE_REFERENCE.REQUESTED);

export const removeReference = createAction(REMOVE_REFERENCE.REQUESTED, refId => ({ payload: { refId } }));

export const addReferenceUser = createAction(ADD_REFERENCE_USER.REQUESTED, (refId, user) => ({
    payload: { refId, user }
}));

export const editReferenceUser = createAction(EDIT_REFERENCE_USER.REQUESTED, (refId, userId, update) => ({
    payload: { refId, userId, update }
}));

export const removeReferenceUser = createAction(REMOVE_REFERENCE_USER.REQUESTED, (refId, userId) => ({
    payload: { refId, userId }
}));

export const addReferenceGroup = createAction(ADD_REFERENCE_GROUP.REQUESTED, (refId, group) => ({
    payload: { refId, group }
}));

export const editReferenceGroup = createAction(EDIT_REFERENCE_GROUP.REQUESTED, (refId, groupId, update) => ({
    payload: { refId, groupId, update }
}));

export const removeReferenceGroup = createAction(REMOVE_REFERENCE_GROUP.REQUESTED, (refId, groupId) => ({
    payload: { refId, groupId }
}));

export const checkUpdates = createAction(CHECK_REMOTE_UPDATES.REQUESTED, refId => ({ payload: { refId } }));

export const updateRemoteReference = createAction(UPDATE_REMOTE_REFERENCE.REQUESTED, refId => ({ payload: { refId } }));
