import {
    WS_INSERT_GROUP,
    WS_UPDATE_GROUP,
    WS_REMOVE_GROUP,
    LIST_GROUPS,
    CREATE_GROUP,
    SET_GROUP_PERMISSION,
    REMOVE_GROUP,
    REMOVE_ACTIVE_GROUP,
    GET_GROUP,
    SET_GROUP_NAME
} from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

export const wsInsertGroup = createAction(WS_INSERT_GROUP);

export const wsUpdateGroup = createAction(WS_UPDATE_GROUP);

export const wsRemoveGroup = createAction(WS_REMOVE_GROUP);

export const removeActiveGroup = createAction(REMOVE_ACTIVE_GROUP);

/**
 * Returns an action that triggers a request for all groups from the API.
 *
 * @func
 */
export const listGroups = createAction(LIST_GROUPS.REQUESTED);

/**
 * Returns an action that triggers a API request to create a group with the given `name`.
 *
 * @func
 * @param name {string} the name for the new group
 * @returns {object}
 */
export const createGroup = createAction(CREATE_GROUP.REQUESTED, name => ({ payload: { name } }));

export const setGroupName = createAction(SET_GROUP_NAME.REQUESTED, (groupId, name) => ({ payload: { groupId, name } }));

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

/**
 * Returns an action that triggers a API request to fetch complete information for the group of id `groupId`.
 *
 * @func
 * @param groupId {string} the id for the new group
 * @returns {object}
 */
export const getGroup = createAction(GET_GROUP.REQUESTED, groupId => ({ payload: { groupId } }));
