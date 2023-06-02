import { Request } from "../app/request";

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
    Request.put(`/analyses/${analysisId}/${sequenceIndex}/blast`, {});

export const remove = ({ analysisId }) => Request.delete(`/analyses/${analysisId}`);
