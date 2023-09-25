import { Request } from "../app/request";

export const find = ({ refId, term, verified, page }) =>
    Request.get(`/refs/${refId}/otus`).query({ find: term, page, verified: verified || undefined });

export const listNames = ({ refId }) => Request.get(`/refs/${refId}/otus?names=true`);

export const get = ({ otuId }) => Request.get(`/otus/${otuId}`);

export const getHistory = ({ otuId }) => Request.get(`/otus/${otuId}/history`);

export const getGenbank = accession => Request.get(`/genbank/${accession}`);

export const create = ({ refId, name, abbreviation }) =>
    Request.post(`/refs/${refId}/otus`).send({
        name,
        abbreviation,
    });

export const edit = ({ otuId, name, abbreviation, schema }) =>
    Request.patch(`/otus/${otuId}`).send({
        name,
        abbreviation,
        schema,
    });

export const remove = ({ otuId }) => Request.delete(`/otus/${otuId}`);

export const addIsolate = ({ otuId, sourceType, sourceName }) =>
    Request.post(`/otus/${otuId}/isolates`).send({
        source_type: sourceType,
        source_name: sourceName,
    });

export const editIsolate = ({ otuId, isolateId, sourceType, sourceName }) =>
    Request.patch(`/otus/${otuId}/isolates/${isolateId}`).send({
        source_type: sourceType,
        source_name: sourceName,
    });

export const setIsolateAsDefault = ({ otuId, isolateId }) =>
    Request.put(`/otus/${otuId}/isolates/${isolateId}/default`);

export const removeIsolate = ({ otuId, isolateId }) => Request.delete(`/otus/${otuId}/isolates/${isolateId}`);

export const addSequence = ({ otuId, isolateId, accession, definition, host, sequence, segment, target }) =>
    Request.post(`/otus/${otuId}/isolates/${isolateId}/sequences`).send({
        accession,
        definition,
        host,
        sequence,
        segment,
        target,
    });

export const editSequence = ({
    otuId,
    isolateId,
    sequenceId,
    accession,
    definition,
    host,
    sequence,
    segment,
    target,
}) =>
    Request.patch(`/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`).send({
        accession,
        definition,
        host,
        sequence,
        segment,
        target,
    });

export const removeSequence = ({ otuId, isolateId, sequenceId }) =>
    Request.delete(`/otus/${otuId}/isolates/${isolateId}/sequences/${sequenceId}`);

export const revert = ({ change_id }) => Request.delete(`/history/${change_id}`);

/**
 * Find a list of OTUs.
 *
 * @param refId - the unique identifier of the reference to search
 * @param term - The search term to filter OTUs by name or abbreviation
 * @param verified - Whether OTUs should be filtered by verified status
 * @param page - The page of results to fetch
 * @returns A Promise resolving to a page of OTUs
 */
export const findOTUs = ({ refId, term, verified, page }) =>
    Request.get(`/refs/${refId}/otus`)
        .query({ find: term, page, verified: verified || undefined })
        .then(response => response.body);
