import { Request } from "../app/request";
import { Sample } from "./types";

export const find = ({ term, labels, workflows, page = 1 }) => {
    const request = Request.get("/samples").query({
        page,
    });

    if (term) {
        request.query({ find: term });
    }

    if (workflows) {
        request.query({ workflows });
    }

    if (labels) {
        labels.forEach(label => request.query({ label }));
    }

    request.sortQuery();

    return request;
};

export const get = ({ sampleId }) => Request.get(`/samples/${sampleId}`);

export const create = action => {
    const { name, isolate, host, locale, libraryType, subtractions, files, labels, group } = action;
    return Request.post("/samples").send({
        name,
        isolate,
        host,
        locale,
        subtractions,
        files,
        library_type: libraryType,
        labels,
        group,
    });
};

export const update = ({ sampleId, update }) => Request.patch(`/samples/${sampleId}`).send(update);

/**
 * Fetch a page of samples
 *
 * @param page - The page to fetch
 * @param per_page - The number of samples to fetch per page
 * @param term - The search term to filter samples by
 * @param labels - Filter the samples by labels
 * @param workflows - Filter the samples by workflows
 */
export function listSamples(page: number, per_page: number, term: string, labels: string[], workflows: string[]) {
    return Request.get("/samples")
        .query({ page, per_page, find: term, label: labels, workflows })
        .then(res => res.body);
}

/**
 * Fetch a single sample
 *
 * @param sampleId - The id of the sample to fetch
 * @returns A promise resolving to a single sample
 */
export function getSample(sampleId: string): Promise<Sample> {
    return Request.get(`/samples/${sampleId}`).then(res => res.body);
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
export function updateSample(sampleId: string, update: SampleUpdate): Promise<Sample> {
    return Request.patch(`/samples/${sampleId}`)
        .send(update)
        .then(response => response.body);
}

/**
 * Remove a sample
 *
 * @param sampleId - The id of the sample to remove
 * @returns A promise that resolves to null upon the removal of a sample
 */
export function removeSample(sampleId: string): Promise<null> {
    return Request.delete(`/samples/${sampleId}`).then(response => response.body);
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
export function updateSampleRights(sampleId: string, update: SampleRightsUpdate): Promise<SampleRightsUpdateReturn> {
    return Request.patch(`/samples/${sampleId}/rights`)
        .send(update)
        .then(response => response.body);
}
