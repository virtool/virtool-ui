/**
 * Functions for communication with API endpoints related to managing HMMs.
 *
 * @module hmm/api
 */
import { Request } from "../app/request";

/**
 * Fetch a page of HMM search results from the API.
 *
 * @param term {string} search term to filter results by
 * @param page {number} page number to return
 * @returns {promise} resolves to an object containing the paginated list of HMMs
 */
export function find({ term, page }) {
    return Request.get("/hmms").query({ find: term, page });
}

/**
 * Initiate HMM installation.
 *
 * @returns {promise} resolves to an object containing the response.
 */
export function install() {
    return Request.post("/hmms/status/updates");
}

/**
 * Fetch a single complete HMM.
 *
 * @param hmmId {string} the unique id for the HMM to fetch
 * @returns {promise} resolves to an object containing a single HMM
 */
export function fetch({ hmmId }) {
    return Request.get(`/hmms/${hmmId}`);
}
