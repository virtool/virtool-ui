/**
 * Functions for communication with API endpoints related to managing HMMs.
 *
 * @module hmm/api
 */
import { Request } from "../app/request";

/**
 * Sagas compatible function for fetching a list of HMMs from the API.
 *
 * @param term {string} search term to filter results by
 * @param page {number} page number to return
 * @returns {promise} resolves to an object containing the paginated list of HMMs
 */
export function find({ term, page }) {
    return Request.get("/hmms").query({ find: term, page });
}

/**
 * Sagas compatible function for initiating an HMM installation.
 *
 * @returns {promise} resolves to an object containing the response.
 */
export function install() {
    return Request.post("/hmms/status/updates");
}

/**
 * Sagas compatible function for fetching a single complete HMM.
 *
 * @param hmmId {string} the unique id for the HMM to fetch
 * @returns {promise} resolves to an object containing a single HMM
 */
export function fetch({ hmmId }) {
    return Request.get(`/hmms/${hmmId}`);
}

/**
 * Sagas compatible function for fetching a deleting all HMMs.
 * Note: the backend currently does not support purging hmms
 *
 * @returns {promise} resolves to an object containing the response.
 */
export function purge() {
    return Request.delete("/hmms");
}
