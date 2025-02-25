import { Request } from "../app/request";
import { MLModelSearchResult } from "./types";

/**
 * Get a list of all machine learning models from the API
 *
 * @returns A promise resolving to the list of machine learning models
 */

export function findModels(): Promise<MLModelSearchResult> {
    return Request.get("/ml").then((response) => response.body);
}
