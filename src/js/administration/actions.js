import { GET_SETTINGS, UPDATE_SETTINGS } from "../app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns action that can trigger an API call for retrieving settings.
 *
 * @func
 * @returns {object}
 */
export const getSettings = createAction(GET_SETTINGS.REQUESTED);

/**
 * Returns action that can trigger an API call to update a specific setting.
 *
 * @func
 * @param key {string} property name to update
 * @param value {any} new value to replace old value
 * @returns {object}
 */
export const updateSetting = (key, value) => {
    const update = {};
    update[key] = value;
    return updateSettings(update);
};

/**
 * Returns action that can trigger an API call for updating multiple settings fields.
 *
 * @func
 * @param update {object} update data of key-value pairs
 * @returns {object}
 */
export const updateSettings = createAction(UPDATE_SETTINGS.REQUESTED, update => ({
    payload: { update }
}));
