import { createAction } from "@reduxjs/toolkit";
import { GET_INITIAL_STATE } from "./actionTypes";

/**
 * Returns action that can trigger an API calls to get the initial state of the application
 *
 * @func
 * @returns {object}
 */
export const getInitialState = createAction(GET_INITIAL_STATE.REQUESTED);
