import { createAction } from "@reduxjs/toolkit";
import { FIND_HMMS, GET_HMM, INSTALL_HMMS, PURGE_HMMS, UPDATE_HMMS_STATUS } from "../app/actionTypes";

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

/**
 * Returns action that can trigger an API call for purging all HMMs. In other words, removing unreferenced HMM profiles
 * and deleting the profiles.hmm file.
 *
 * @func
 * @returns {object}
 */
export const purgeHMMs = createAction(PURGE_HMMS.REQUESTED);

/**
 * Returns action that triggers updating the local status of HMMs.
 *
 * @func
 * @param HMMStatus {object} updates to the local HMM status
 * @returns {object}
 */
export const updateStatus = createAction(UPDATE_HMMS_STATUS, HMMStatus => ({
    payload: HMMStatus,
}));
