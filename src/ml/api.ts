import { apiClient } from "../app/api";
import { MLModelSearchResult } from "./types";

/**
 * Get a list of all machine learning models from the API
 *
 * @returns A promise resolving to the list of machine learning models
 */

export function findModels(): Promise<MLModelSearchResult> {
    return apiClient.get("/ml").then((response) => response.body);
}
