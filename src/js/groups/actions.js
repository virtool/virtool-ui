import {
    WS_INSERT_GROUP,
    WS_UPDATE_GROUP,
    WS_REMOVE_GROUP,
    LIST_GROUPS,
    CREATE_GROUP,
    SET_GROUP_PERMISSION,
    REMOVE_GROUP,
    CHANGE_ACTIVE_GROUP
} from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const wsInsertGroup = createAction(WS_INSERT_GROUP);

export const wsUpdateGroup = createAction(WS_UPDATE_GROUP);

export const wsRemoveGroup = createAction(WS_REMOVE_GROUP);

export const changeActiveGroup = createAction(CHANGE_ACTIVE_GROUP, id => ({ payload: { id } }));

/**
 * Returns an action that triggers a request for all groups from the API.
 *
 * @func
 */
export const listGroups = createAction(LIST_GROUPS.REQUESTED);

/**
 * Returns an action that triggers a API request to create a group with the given `groupId`.
 *
 * @func
 * @param groupId {string} the id for the new group
 * @returns {object}
 */
export const createGroup = createAction(CREATE_GROUP.REQUESTED, groupId => ({ payload: { groupId } }));

/**
 * Returns action that can trigger an API request for modifying group permissions.
 *
 * @param groupId {string} the id for the specific group
 * @param permission {string} the specific permission field
 * @param value {boolean} is checked or not
 * @returns {object}
 */
export const setGroupPermission = createAction(SET_GROUP_PERMISSION.REQUESTED, (groupId, permission, value) => ({
    payload: { groupId, permission, value }
}));

/**
 * Returns an action that triggers a API request to remove a group with the given `groupId`.
 *
 * @func
 * @param groupId {string} the id for the new group
 * @returns {object}
 */
export const removeGroup = createAction(REMOVE_GROUP.REQUESTED, groupId => ({ payload: { groupId } }));
