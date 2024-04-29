import { EDIT_SEQUENCE, GET_OTU, GET_OTU_HISTORY, REVERT, WS_UPDATE_OTU } from "@app/actionTypes";
import { createAction } from "@reduxjs/toolkit";

/**
 * Returns an action that should be dispatched when an OTU is updated via websocket.
 *
 * @func
 * @param data {object} the data passed in the websocket message
 * @returns {object}
 */
export const wsUpdateOTU = createAction(WS_UPDATE_OTU);

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
