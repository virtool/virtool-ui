import { apiClient } from "@/api";
import {
    Subtraction,
    SubtractionSearchResult,
    SubtractionShortlist,
} from "./types";

export const shortlist = () => apiClient.get("/subtractions?short=true");

/**
 * Creates a subtraction
 *
 * @param name - The name of the subtraction
 * @param nickname - The nickname of the subtraction
 * @param uploadId - The id of the file used to create the subtraction
 * @returns A promise resolving to creating a subtraction
 */
export function createSubtraction(
    name: string,
    nickname: string,
    uploadId: string,
): Promise<Subtraction> {
    return apiClient
        .post("/subtractions")
        .send({
            name,
            nickname,
            upload_id: uploadId,
        })
        .then((response) => response.body);
}

/**
 * Fetch a page of subtractions
 *
 * @param page - The page to fetch
 * @param per_page - The number of subtractions to fetch per page
 * @param term - The search term to filter subtractions by
 * @returns A promise resolving to a page of subtraction search results
 */
export function findSubtractions(
    page: number,
    per_page: number,
    term: string,
): Promise<SubtractionSearchResult> {
    return apiClient
        .get("/subtractions")
        .query({ page, per_page, find: term })
        .then((response) => response.body);
}

/**
 * Fetch a single subtraction
 *
 * @param subtractionId - The id of the subtraction to fetch
 * @returns A promise resolving to a single subtraction
 */
export function getSubtraction(subtractionId: string): Promise<Subtraction> {
    return apiClient
        .get(`/subtractions/${subtractionId}`)
        .then((response) => response.body);
}

/**
 * Updates the data for the subtraction
 *
 * @param subtractionId - The id of the subtraction to be updated
 * @param name - The updated name of the subtraction
 * @param nickname - The updated nickname of the subtraction
 * @returns A promise resolving to updating a subtraction
 */
export function updateSubtraction(
    subtractionId: string,
    name: string,
    nickname: string,
): Promise<Subtraction> {
    return apiClient
        .patch(`/subtractions/${subtractionId}`)
        .send({ name, nickname })
        .then((response) => response.body);
}

/**
 * Removes a subtraction
 *
 * @param subtractionId - The id of the subtraction to be removed
 * @returns A promise resolving to removing a subtraction
 */
export function removeSubtraction(subtractionId: string): Promise<Response> {
    return apiClient
        .delete(`/subtractions/${subtractionId}`)
        .then((response) => response.body);
}

/**
 * Fetches a shortlist of subtractions
 *
 * @returns A promise resolving to list of shortlisted subtractions
 */
export function fetchSubtractionShortlist(
    ready: boolean,
): Promise<SubtractionShortlist[]> {
    return apiClient
        .get("/subtractions")
        .query({ short: true, ready })
        .then((response) => response.body);
}
