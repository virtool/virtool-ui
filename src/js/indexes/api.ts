import { Request } from "../app/request";
import { IndexSearchResult } from "./types";

/**
 * Get a paginated list of indexes.
 *
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @param page - The page to fetch
 * @returns  A promise resolving to the API response containing the paginated list of indexes
 */
export function find({ refId, term, page }) {
    return Request.get(`/refs/${refId}/indexes`).query({ find: term, page });
}

/**
 * Get the details of an index
 *
 * @param indexId - The unique identifier of the index to fetch
 * @returns A promise resolving to the API response containing the index details
 */

export function get({ indexId }) {
    return Request.get(`/indexes/${indexId}`);
}

/**
 * Get a list of indexes that are ready to use
 *
 * @returns A promise resolving to the API response containing the list of ready indexes
 */
export function listReady() {
    return Request.get("/indexes")
        .query({ ready: true })
        .then(res => res.body);
}

/**
 * Get a list of unbuilt changes for a reference
 *
 * @param refId - The unique identifier of the reference to fetch unbuilt changes for
 * @returns A promise resolving to the API response containing the unbuilt changes
 */
export function getUnbuilt({ refId }) {
    return Request.get(`/refs/${refId}/history?unbuilt=true`);
}

/**
 * Create a new index
 *
 * @param refId - The unique identifier of the reference to create the index for
 * @returns A promise resolving to the API response from creating the index
 */
export function create({ refId }) {
    return Request.post(`/refs/${refId}/indexes`);
}

/**
 * Get the history of an index.
 *
 * @param indexId - The unique identifier of the index to fetch the history of
 * @param page - The page to fetch
 * @returns A promise resolving to the API response containing the index history
 */
export function getHistory({ indexId, page = 1 }: { indexId: string; page: number }) {
    return Request.get(`/indexes/${indexId}/history?page=${page}`);
}

/**
 * Get a paginated list of indexes.
 *
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @param page - The page to fetch
 * @returns  A promise resolving to a paginated list of indexes
 */
export function findIndexes({
    refId,
    term,
    page,
}: {
    refId: string;
    term: string;
    page: number;
}): Promise<IndexSearchResult> {
    return Request.get(`/refs/${refId}/indexes`)
        .query({ find: term, page })
        .then(res => res.body);
}
