import { createAction } from "@reduxjs/toolkit";
import { FIND_HMMS, GET_HMM, INSTALL_HMMS } from "../app/actionTypes";

export const findHmms = createAction(FIND_HMMS.REQUESTED, (term, page) => ({
    payload: { term, page },
}));

/**
 * Returns action that can trigger an API call for getting specific hmm documents from database.
 *
 * @func
 * @param hmmId {string} unique id for specific hmm document
 * @returns {object}
 */
export const getHmm = createAction(GET_HMM.REQUESTED, hmmId => ({ payload: { hmmId } }));

/**
 * Returns action that can trigger an API call for installing HMMs from virtool repository.
 *
 * @func
 * @returns {object}
 */
export const installHMMs = createAction(INSTALL_HMMS.REQUESTED, releaseId => ({ payload: { release_id: releaseId } }));
