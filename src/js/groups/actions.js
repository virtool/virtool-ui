import { createAction } from "@reduxjs/toolkit";
import { LIST_GROUPS, WS_INSERT_GROUP, WS_REMOVE_GROUP, WS_UPDATE_GROUP } from "../app/actionTypes";

export const wsInsertGroup = createAction(WS_INSERT_GROUP);

export const wsUpdateGroup = createAction(WS_UPDATE_GROUP);

export const wsRemoveGroup = createAction(WS_REMOVE_GROUP);

/**
 * Returns an action that triggers a request for all groups from the API.
 *
 * @func
 */
export const listGroups = createAction(LIST_GROUPS.REQUESTED);
