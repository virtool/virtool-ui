import { createAction } from "@reduxjs/toolkit";
import { GET_SETTINGS } from "../app/actionTypes";

/**
 * Returns action that can trigger an API call for retrieving settings.
 *
 * @func
 * @returns {object}
 */
export const getSettings = createAction(GET_SETTINGS.REQUESTED);
