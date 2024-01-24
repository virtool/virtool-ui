import { Request } from "../app/request";
import { Analysis, AnalysisSearchResult } from "./types";

export const find = ({ sampleId, term, page = 1 }) =>
    Request.get(`/samples/${sampleId}/analyses`).query({ find: term, page });

export const get = ({ analysisId }) => Request.get(`/analyses/${analysisId}`);

export const analyze = ({ sampleId, refId, subtractionIds, workflow }) =>
    Request.post(`/samples/${sampleId}/analyses`).send({
        workflow,
        ref_id: refId,
        subtractions: subtractionIds,
    });

export const blastNuvs = ({ analysisId, sequenceIndex }) =>
    Request.put(`/analyses/${analysisId}/${sequenceIndex}/blast`);

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
    return Request.get(`/samples/${sampleId}/analyses`)
        .query({ page, per_page, find: term })
        .then(res => res.body);
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
): Promise<Analysis> {
    return Request.post(`/samples/${sampleId}/analyses`)
        .send({
            workflow,
            ref_id: refId,
            subtractions: subtractionIds,
            ml: mlModel,
        })
        .then(res => res.body);
}

/**
 * Remove an analysis
 *
 * @param analysisId - The id of the analysis to remove
 * @returns A promise resolving to the removal of an analysis
 */
export function removeAnalysis(analysisId: string): Promise<null> {
    return Request.delete(`/analyses/${analysisId}`).then(res => res.body);
}
