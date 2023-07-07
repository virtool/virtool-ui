import { createAction } from "@reduxjs/toolkit";
import {
    CLEAR_SAMPLE_SELECTION,
    CREATE_SAMPLE,
    DESELECT_SAMPLES,
    FIND_SAMPLES,
    GET_SAMPLE,
    HIDE_SAMPLE_MODAL,
    REMOVE_SAMPLE,
    SELECT_SAMPLE,
    SHOW_REMOVE_SAMPLE,
    UPDATE_SAMPLE,
    UPDATE_SAMPLE_RIGHTS,
    UPDATE_SEARCH,
    WS_INSERT_SAMPLE,
    WS_REMOVE_SAMPLE,
    WS_UPDATE_SAMPLE,
} from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when a sample document is inserted via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */

export const wsInsertSample = createAction(WS_INSERT_SAMPLE);

/**
 * Returns an action that should be dispatched when a sample document is updated via websocket.
 *
 * @func
 * @param data {object} update data passed in the websocket message
 * @returns {object} an action object
 */
export const wsUpdateSample = createAction(WS_UPDATE_SAMPLE);

/**
 * Returns an action that should be dispatched when a sample document is removed via websocket.
 *
 * @func
 * @param data {string} the id for the specific sample
 * @returns {object}
 */
export const wsRemoveSample = createAction(WS_REMOVE_SAMPLE);

export const updateSearch = createAction(UPDATE_SEARCH, parameters => ({ payload: { parameters } }));

export const findSamples = createAction(FIND_SAMPLES.REQUESTED, ({ labels, page, term, workflows }) => ({
    payload: {
        labels,
        term,
        page,
        workflows,
    },
}));

/**
 * Returns action that can trigger an API call for getting a specific sample.
 *
 * @func
 * @param sampleId {string} the id for the specific sample
 * @returns {object}
 */
export const getSample = createAction(GET_SAMPLE.REQUESTED, sampleId => ({
    payload: {
        sampleId,
    },
}));

/**
 * Returns action that updates state with returned sample object
 *
 * @func
 * @param sample {onject} object containing sample details
 * @param canModify {boolean} boolean indicating if the user can modify the sample
 * @returns {object}
 */
export const getSampleSucceeded = createAction(GET_SAMPLE.SUCCEEDED, (sample, canModify) => ({
    payload: {
        ...sample,
        canModify,
    },
}));

/**
 * Returns action that can trigger an API call for creating a new sample.
 *
 * @func
 * @param name {string} unique name for the sample
 * @param isolate {string} the originating isolate
 * @param host {string} the exact host
 * @param locale {string} location in which the sample was collected
 * @param notes {string} notes for the sample
 * @param srna {boolean} does the sample contain sRNA reads
 * @param subtractions {Array} string - names of the associated subtraction host genomes
 * @param files {object} file ids of one or two files
 * @param group {string} user group the sample will be assigned to
 * @param label {Array} Array of ids(int) of the labels selected
 * @returns {object}
 */
export const createSample = createAction(
    CREATE_SAMPLE.REQUESTED,
    (name, isolate, host, locale, libraryType, subtractions, files, labels, group) => ({
        payload: {
            name,
            isolate,
            host,
            locale,
            libraryType,
            subtractions,
            files,
            labels,
            group,
        },
    }),
);

/**
 * Returns action that can trigger an API call for modifying a sample.
 *
 * @func
 * @param sampleId {string} unique sample id
 * @param update {object} update data
 * @returns {object}
 */
export const editSample = createAction(UPDATE_SAMPLE.REQUESTED, (sampleId, update) => ({
    payload: { sampleId, update },
}));

/**
 * Returns action that can trigger an API call for modifying sample rights.
 *
 * @func
 * @param sampleId {string} unique sample id
 * @param update {object} update data
 * @returns {object}
 */
export const updateSampleRights = createAction(UPDATE_SAMPLE_RIGHTS.REQUESTED, (sampleId, update) => ({
    payload: { sampleId, update },
}));

/**
 * Returns action that can trigger an API call for removing a sample.
 *
 * @func
 * @param sampleId {string} unique sample id
 * @returns {object}
 */
export const removeSample = createAction(REMOVE_SAMPLE.REQUESTED, sampleId => ({ payload: { sampleId } }));

/**
 * Returns action for displaying the remove sample modal.
 *
 * @func
 * @returns {object}
 */
export const showRemoveSample = createAction(SHOW_REMOVE_SAMPLE);

/**
 * Returns action for hiding the sample modal.
 *
 * @func
 * @returns {object}
 */
export const hideSampleModal = createAction(HIDE_SAMPLE_MODAL);

export const selectSample = createAction(SELECT_SAMPLE, sampleId => ({ payload: { sampleId } }));

export const deselectSamples = createAction(DESELECT_SAMPLES, sampleIds => ({ payload: { sampleIds } }));

export const clearSampleSelection = createAction(CLEAR_SAMPLE_SELECTION);
