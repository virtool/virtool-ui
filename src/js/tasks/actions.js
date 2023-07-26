import { createAction } from "@reduxjs/toolkit";
import { GET_TASK, LIST_TASKS, WS_INSERT_TASK, WS_UPDATE_TASK } from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a task document is inserted via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsInsertTask = createAction(WS_INSERT_TASK);

/**
 * Returns an action that should be dispatched when a task document is updated via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsUpdateTask = createAction(WS_UPDATE_TASK);

export const listTasks = createAction(LIST_TASKS.REQUESTED);

export const getTask = createAction(GET_TASK, taskId => ({ payload: { taskId } }));
