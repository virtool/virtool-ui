import { Request } from "@app/request";
import { Index, IndexSearchResult, UnbuiltChangesSearchResults } from "./types";

/**
 * Get the details of an index
 *
 * @param indexId - The unique identifier of the index to fetch
 * @returns A promise resolving to the API response containing the index details
 */

export function getIndex(indexId: string) {
    return Request.get(`/indexes/${indexId}`).then(res => res.body);
}

/**
 * Get a list of indexes that are ready to use
 *
 * @returns A promise resolving to the API response containing the list of ready indexes
 */
export function listReady() {
    return Request.get("/indexes").query({ ready: true });
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

/**
 * Get a list of indexes
 *
 * @param ready - Whether the index is ready
 * @param term - The search term to filter indexes by
 * @returns A promise resolving to a list of indexes
 */
export function listIndexes({ ready, term }: { ready: boolean; term: string }) {
    return Request.get("/indexes")
        .query({ ready, find: term })
        .then(res => res.body);
}

/**
 * Get a list of unbuilt changes for a reference
 *
 * @param refId - The unique identifier of the reference to fetch unbuilt changes for
 * @returns A promise resolving to the API response containing the unbuilt changes
 */
export function getUnbuiltChanges(refId: string): Promise<UnbuiltChangesSearchResults> {
    return Request.get(`/refs/${refId}/history?unbuilt=true`).then(res => res.body);
}

/**
 * Create a new index
 *
 * @param refId - The unique identifier of the reference to create the index for
 * @returns A promise resolving to the API response from creating the index
 */
export function createIndex(refId: string): Promise<Index> {
    return Request.post(`/refs/${refId}/indexes`).then(res => res.body);
}
