import { apiClient } from "@app/api";
import { Sample, SampleSearchResult } from "./types";

/**
 * Fetch a page of samples
 *
 * @param page - The page to fetch
 * @param per_page - The number of samples to fetch per page
 * @param term - The search term to filter samples by
 * @param labels - Filter the samples by labels
 * @param workflows - Filter the samples by workflows
 */
export function listSamples(
    page: number,
    per_page: number,
    term: string,
    labels: string[],
    workflows: string[],
): Promise<SampleSearchResult> {
    return apiClient
        .get("/samples")
        .query({ page, per_page, find: term, label: labels, workflows })
        .then((res) => res.body);
}

/**
 * Fetch a single sample
 *
 * @param sampleId - The id of the sample to fetch
 * @returns A promise resolving to a single sample
 */
export function getSample(sampleId: string): Promise<Sample> {
    return apiClient.get(`/samples/${sampleId}`).then((res) => res.body);
}

/**
 * Creates a sample
 *
 * @param name - The sample name
 * @param isolate - Isolate associated with the sample
 * @param host - The name of the host species the virus was identified in
 * @param locale - The geographical location of the virus detection
 * @param libraryType - Library type for the sample
 * @param subtractions - The id of the subtractions assigned to the sample
 * @param files - The id of the uploads used to create the sample
 * @param labels - The id of the labels assigned to the sample
 * @param group - The of the group assigned to the sample
 * @returns A promise resolving to creating a sample
 */
export function createSample(
    name: string,
    isolate: string,
    host: string,
    locale: string,
    libraryType: string,
    subtractions: string[],
    files: string[],
    labels: number[],
    group: string,
): Promise<Sample> {
    return apiClient
        .post("/samples")
        .send({
            name,
            isolate,
            host,
            locale,
            subtractions,
            files,
            library_type: libraryType,
            labels,
            group,
        })
        .then((res) => res.body);
}

export type SampleUpdate = {
    isolate?: string;
    labels?: number[];
    locale?: string;
    name?: string;
    notes?: string;
    subtractions?: string[];
};

/**
 * Updates the data for a sample
 *
 * @param sampleId - The id of the sample to be updated
 * @param update - The update to apply to the sample
 * @returns A promise resolving to a response containing the updated sample's data
 */
export function updateSample(
    sampleId: string,
    update: SampleUpdate,
): Promise<Sample> {
    return apiClient
        .patch(`/samples/${sampleId}`)
        .send(update)
        .then((response) => response.body);
}

/**
 * Remove a sample
 *
 * @param sampleId - The id of the sample to remove
 * @returns A promise that resolves to null upon the removal of a sample
 */
export function removeSample(sampleId: string): Promise<null> {
    return apiClient
        .delete(`/samples/${sampleId}`)
        .then((response) => response.body);
}

/** Data returned from API on sample rights update */
export type SampleRightsUpdateReturn = {
    all_read: boolean;
    all_write: boolean;
    group: number | string | null;
    group_read: boolean;
    group_write: boolean;
    user: { [key: string]: string };
};

export type SampleRightsUpdate = {
    group?: number | string | null;
    group_read?: boolean;
    group_write?: boolean;
    all_read?: boolean;
    all_write?: boolean;
};

/**
 * Updates the rights for a sample
 *
 * @param sampleId - The id of the sample to be updated
 * @param update - The update to apply to the sample
 * @returns A promise resolving to a response containing the updated sample's data
 */
export function updateSampleRights(
    sampleId: string,
    update: SampleRightsUpdate,
): Promise<SampleRightsUpdateReturn> {
    return apiClient
        .patch(`/samples/${sampleId}/rights`)
        .send(update)
        .then((response) => response.body);
}
