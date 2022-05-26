import { Request } from "../app/request";

export const find = ({ term, page, archived }) =>
    Request.get("/api/jobs").query({ find: term, page, archived, beta: true });

export const get = ({ jobId }) => Request.get(`/api/jobs/${jobId}`);

export const cancel = ({ jobId }) => Request.put(`/api/jobs/${jobId}/cancel`);

export const archive = ({ jobId }) => Request.patch(`/api/jobs/${jobId}/archive`);
