import { apiClient } from "@/api";
import { Index, IndexSearchResult, UnbuiltChangesSearchResults } from "./types";

/**
 * Get the details of an index
 *
 * @param indexId - The unique identifier of the index to fetch
 * @returns A promise resolving to the API response containing the index details
 */

export function getIndex(indexId: string) {
    return apiClient.get(`/indexes/${indexId}`).then((res) => res.body);
}

/**
 * Get a paginated list of indexes.
 *
 * @param page - The page to fetch
 * @param per_page -The number of indexes to fetch per page
 * @param refId - The reference id to fetch the indexes of
 * @param term - The search term to filter indexes by
 * @returns  A promise resolving to a paginated list of indexes
 */
export function findIndexes(
    page: number,
    per_page: number,
    refId: string,
    term: string,
): Promise<IndexSearchResult> {
    return apiClient
        .get(`/refs/${refId}/indexes`)
        .query({ find: term, page, per_page })
        .then((res) => res.body);
}

/**
 * Get a list of indexes
 *
 * @param ready - Whether the index is ready
 * @param term - The search term to filter indexes by
 * @returns A promise resolving to a list of indexes
 */
export function listIndexes({ ready, term }: { ready: boolean; term: string }) {
    return apiClient
        .get("/indexes")
        .query({ ready, find: term })
        .then((res) => res.body);
}

/**
 * Get a list of unbuilt changes for a reference
 *
 * @param refId - The unique identifier of the reference to fetch unbuilt changes for
 * @returns A promise resolving to the API response containing the unbuilt changes
 */
export function getUnbuiltChanges(
    refId: string,
): Promise<UnbuiltChangesSearchResults> {
    return apiClient
        .get(`/refs/${refId}/history?unbuilt=true`)
        .then((res) => res.body);
}

/**
 * Create a new index
 *
 * @param refId - The unique identifier of the reference to create the index for
 * @returns A promise resolving to the API response from creating the index
 */
export function createIndex(refId: string): Promise<Index> {
    return apiClient.post(`/refs/${refId}/indexes`).then((res) => res.body);
}
