import { forEach } from "lodash-es";
import { Request } from "../app/request";

export const find = ({ archived, states }) => {
    const request = Request.get("/api/jobs").query({ archived, beta: true });
    forEach(states, state => request.query({ state }));
    return request;
};

export const get = ({ jobId }) => Request.get(`/api/jobs/${jobId}`);
export const cancel = ({ jobId }) => Request.put(`/api/jobs/${jobId}/cancel`);
export const archive = ({ jobId }) => Request.patch(`/api/jobs/${jobId}/archive`);
