import { createAction } from "@reduxjs/toolkit";
import {
    ADD_ISOLATE,
    ADD_SEQUENCE,
    CREATE_OTU,
    EDIT_ISOLATE,
    EDIT_OTU,
    EDIT_SEQUENCE,
    GET_OTU,
    GET_OTU_HISTORY,
    HIDE_OTU_MODAL,
    REMOVE_ISOLATE,
    REMOVE_OTU,
    REMOVE_SEQUENCE,
    REVERT,
    SELECT_ISOLATE,
    SET_ISOLATE_AS_DEFAULT,
    SHOW_EDIT_ISOLATE,
    SHOW_EDIT_OTU,
    SHOW_REMOVE_ISOLATE,
    SHOW_REMOVE_OTU,
    SHOW_REMOVE_SEQUENCE,
    WS_INSERT_OTU,
    WS_REMOVE_OTU,
    WS_UPDATE_OTU,
} from "../app/actionTypes";

/**
 * Returns an action that should be dispatched when an OTU is inserted via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsInsertOTU = createAction(WS_INSERT_OTU);

/**
 * Returns an action that should be dispatched when an OTU is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateOTU = createAction(WS_UPDATE_OTU);

/**
 * Returns an action that should be dispatched when an OTU is removed via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsRemoveOTU = createAction(WS_REMOVE_OTU);

/**
 * Returns action that can trigger an API call for retrieving a specific OTU.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @returns {object}
 */
export const getOTU = createAction(GET_OTU.REQUESTED, otuId => ({
    payload: { otuId },
}));

/**
 * Returns action that can trigger an API call for getting a OTU's history.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @returns {object}
 */
export const getOTUHistory = createAction(GET_OTU_HISTORY.REQUESTED, otuId => ({
    payload: { otuId },
}));

/**
 * Returns action that can trigger an API call for creating a new OTU.
 *
 * @func
 * @param name {string} unique OTU name
 * @param abbreviation {string} unique abbreviation for OTU name
 * @returns {object}
 */
export const createOTU = createAction(CREATE_OTU.REQUESTED, (refId, name, abbreviation) => ({
    payload: { refId, name, abbreviation },
}));

/**
 * Returns action that can trigger an API call for modifying a OTU.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param name {string} unique OTU name
 * @param abbreviation {string} unique abbreviation of OTU name
 * @param schema {array} array of sequences in custom order
 * @returns {object}
 */
export const editOTU = createAction(EDIT_OTU.REQUESTED, (otuId, name, abbreviation, schema) => ({
    payload: {
        otuId,
        name,
        abbreviation,
        schema,
    },
}));

/**
 * Returns action that can trigger an API call for removing a OTU.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param history {object} list of all changes made to the OTU
 * @returns {object}
 */
export const removeOTU = createAction(REMOVE_OTU.REQUESTED, (refId, otuId, history) => ({
    payload: { refId, otuId, history },
}));

/**
 * Returns action that can trigger an API call for adding an isolate to a OTU.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param sourceType {string} category of isolate source types
 * @param sourceName {string} the name of the isolate source
 * @returns {object}
 */
export const addIsolate = createAction(ADD_ISOLATE.REQUESTED, (otuId, sourceType, sourceName) => ({
    payload: { otuId, sourceType, sourceName },
}));

/**
 * Returns action that can trigger an API call for modifying which isolate is made default.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @returns {object}
 */
export const setIsolateAsDefault = createAction(SET_ISOLATE_AS_DEFAULT.REQUESTED, (otuId, isolateId) => ({
    payload: { otuId, isolateId },
}));

/**
 * Returns action that can trigger an API call for modifying an isolate.
 *
 * @func
 * @param otuID {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @param sourceType {string} category of isolate source types
 * @param sourceName {string} the name of the isolate source
 * @returns {object}
 */
export const editIsolate = createAction(EDIT_ISOLATE.REQUESTED, (otuId, isolateId, sourceType, sourceName) => ({
    payload: {
        otuId,
        isolateId,
        sourceType,
        sourceName,
    },
}));

/**
 * Returns action that can trigger an API call for removing an isolate from a OTU.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @param nextIsolateId {string} if removed isolate was default,
 * first in resulting list (i.e. the next isolate) becomes default
 * @returns {object}
 */
export const removeIsolate = createAction(REMOVE_ISOLATE.REQUESTED, (otuId, isolateId, nextIsolateId) => ({
    payload: { otuId, isolateId, nextIsolateId },
}));

/**
 * Returns action that can trigger an API call for adding a sequence to an isolate.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @param accession {string} the accession for the sequence
 * @param definition {string} descriptive definition of the sequence
 * @param host {string} the host the sequence originated from
 * @param sequence {string} an abbreviation for the OTU
 * @param segment {string} the schema segment associated with the OTU
 * @param target {string} the reference target associated with the sequence
 * @returns {object}
 */
export const addSequence = createAction(
    ADD_SEQUENCE.REQUESTED,
    ({ otuId, isolateId, accession, definition, host, sequence, segment, target }) => ({
        payload: {
            accession,
            definition,
            host,
            isolateId,
            otuId,
            segment,
            sequence,
            target,
        },
    }),
);

/**
 * Returns action that can trigger an API call for modifying a sequence.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @param sequenceId {string} unique sequence id
 * @param accession {string} a new accession for the sequence
 * @param definition {string} descriptive definition of the sequence
 * @param host {string} the host the sequence originated from
 * @param sequence {string} an abbreviation for the OTU
 * @param segment {string} the schema segment associated with the OTU
 * @param target {string} the barcode target associated with the OTU
 * @returns {object}
 */
export const editSequence = createAction(
    EDIT_SEQUENCE.REQUESTED,
    ({ otuId, isolateId, sequenceId, accession, definition, host, sequence, segment, target }) => ({
        payload: {
            otuId,
            isolateId,
            sequenceId,
            accession,
            definition,
            host,
            sequence,
            segment,
            target,
        },
    }),
);

/**
 * Returns action that can trigger an API call for removing a sequence from an isolate.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @param sequenceId {string} unique sequence id
 * @returns {object}
 */
export const removeSequence = createAction(REMOVE_SEQUENCE.REQUESTED, (otuId, isolateId, sequenceId) => ({
    payload: { otuId, isolateId, sequenceId },
}));

/**
 * Returns action that can trigger an API call for deleting unbuilt changes of a OTU.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param version {string} OTU index version
 * @returns {object}
 */
export const revert = createAction(REVERT.REQUESTED, (otuId, otuVersion, changeId) => ({
    payload: {
        otuId,
        otuVersion,
        change_id: changeId,
    },
}));

/**
 * Returns action that can trigger an API call for deleting unbuilt changes of a OTU.
 *
 * @func
 * @param error {onject} error object
 * @returns {object}
 */
export const revertFailed = createAction(REVERT.FAILED, error => ({
    payload: { error },
}));

/**
 * Returns action that can trigger an API call for deleting unbuilt changes of a OTU.
 *
 * @func
 * @param otu {object} OTU object
 * @param history {object} OTU history object
 * @returns {object}
 */
export const revertSucceeded = createAction(REVERT.SUCCEEDED, (otu, history) => ({
    payload: { otu, history },
}));

/**
 * Returns action for selecting an isolate to view.
 *
 * @func
 * @param isolateId {string} unique isolate id
 * @returns {object}
 */
export const selectIsolate = createAction(SELECT_ISOLATE, isolateId => ({
    payload: { isolateId },
}));

/**
 * Returns action for displaying the edit OTU modal.
 *
 * @func
 * @returns {object}
 */
export const showEditOTU = createAction(SHOW_EDIT_OTU);

/**
 * Returns action for displaying the remove OTU modal.
 *
 * @func
 * @returns {object}
 */
export const showRemoveOTU = createAction(SHOW_REMOVE_OTU);

/**
 * Returns action for displaying the edit isolate modal.
 *
 * @func
 * @param otuId {string} unique OTU id
 * @param isolateId {string} unique isolate id
 * @param sourceType {string} category of isolate source types
 * @param sourceName {string} the name for the isolate source
 * @returns {object}
 */
export const showEditIsolate = createAction(SHOW_EDIT_ISOLATE, (otuId, isolateId, sourceType, sourceName) => ({
    payload: {
        otuId,
        isolateId,
        sourceType,
        sourceName,
    },
}));

/**
 * Returns action for displaying the remove isolate modal.
 *
 * @func
 * @returns {object}
 */
export const showRemoveIsolate = createAction(SHOW_REMOVE_ISOLATE);

/**
 * Returns action for displaying the remove sequence modal.
 *
 * @func
 * @param sequenceId {string} unique sequence id
 * @returns {object}
 */
export const showRemoveSequence = createAction(SHOW_REMOVE_SEQUENCE, sequenceId => ({ payload: { sequenceId } }));

/**
 * Returns action for hiding the OTU modal.
 *
 * @func
 * @returns {object}
 */
export const hideOTUModal = createAction(HIDE_OTU_MODAL);
