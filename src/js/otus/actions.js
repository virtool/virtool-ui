import { EDIT_SEQUENCE, GET_OTU, WS_UPDATE_OTU } from "@app/actionTypes";
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
