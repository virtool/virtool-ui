import { apiClient } from "@app/api";
import { AnalysisSearchResult, GenericAnalysis } from "./types";

/**
 * Fetch a complete analysis
 *
 * @param AnalysisId - The unique identifier of the analysis to fetch
 * @returns A promise resolving to an analysis
 */
export async function getAnalysis({ analysisId }) {
    const response = await apiClient.get(`/analyses/${analysisId}`);
    return response.body;
}

/**
 * Fetch a page of analyses search results
 *
 * @param sampleId - The sample which the analyses are associated with
 * @param page - The page to fetch
 * @param per_page - The number of analyses to fetch per page
 * @param term - The search term to filter the analyses by
 * @returns A promise resolving to a page of analyses search results
 */
export function listAnalyses(
    sampleId: string,
    page: number,
    per_page: number,
    term: string,
): Promise<AnalysisSearchResult> {
    return apiClient
        .get(`/samples/${sampleId}/analyses`)
        .query({ page, per_page, find: term })
        .then((res) => res.body);
}

/**
 * Create a new analysis
 *
 * @param sampleId - The sample which the analysis is associated with
 * @param refId - The reference used in the analysis
 * @param subtractionIds - The subtractions used in the analysis
 * @param workflow - The workflow used in the analysis
 * @param mlModel - The machine learning model used in the analysis
 * @returns A promise resolving to a new analysis
 */
export function createAnalysis(
    mlModel: string,
    refId: string,
    sampleId: string,
    subtractionIds: string[],
    workflow: string,
): Promise<GenericAnalysis> {
    return apiClient
        .post(`/samples/${sampleId}/analyses`)
        .send({
            workflow,
            ref_id: refId,
            subtractions: subtractionIds,
            ml: mlModel,
        })
        .then((res) => res.body);
}

/**
 * Remove an analysis
 *
 * @param analysisId - The id of the analysis to remove
 * @returns A promise resolving to the removal of an analysis
 */
export function removeAnalysis(analysisId: string): Promise<null> {
    return apiClient.delete(`/analyses/${analysisId}`).then((res) => res.body);
}

/**
 * Installs the blast information for the sequence
 *
 * @param analysisId - The id of the analysis the sequence belongs to
 * @param sequenceIndex - The index of the sequence to blast Nuvs for
 * @returns A promise resolving to an installation of blast information
 */
export function blastNuvs(analysisId: string, sequenceIndex: number) {
    return apiClient
        .put(`/analyses/${analysisId}/${sequenceIndex}/blast`)
        .then((res) => res.body);
}
